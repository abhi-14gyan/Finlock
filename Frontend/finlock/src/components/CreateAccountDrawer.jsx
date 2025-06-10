import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {accountSchema} from "../model/zod.model";
import axios from "axios";
import { toast } from "react-toastify";

export function CreateAccountDrawer({ open, setOpen, children}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/v1/account/create",
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Account created successfully");
        reset();
        setOpen(false);
      } else {
        toast.error(response.data.message || "Account creation failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>{children}</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#1C1C2E] rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Account</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Account Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded bg-[#202030] border-[#3A3A55] text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-purple-500"
                  placeholder="e.g., Personal account"
                  {...register("name")}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Account Type</label>
                <select
                  className="w-full px-3 py-2 border rounded bg-[#202030] border-[#3A3A55] text-white focus:outline-none focus:ring focus:ring-purple-500"
                  {...register("type")}
                  defaultValue="CURRENT"
                >
                  <option value="CURRENT">Current</option>
                  <option value="SAVINGS">Savings</option>
                </select>
                {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded bg-[#202030] border-[#3A3A55] text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-purple-500"
                  placeholder="0.00"
                  {...register("balance")}
                />
                {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
              </div>

              <div className="flex items-center justify-between border p-3 rounded-lg border-[#3A3A55]">
                <div>
                  <label className="text-base font-medium text-white">Set as Default</label>
                  <p className="text-sm text-gray-400">This account will be selected by default for transactions.</p>
                </div>
                <input
                  type="checkbox"
                  checked={watch("isDefault")}
                  onChange={(e) => setValue("isDefault", e.target.checked)}
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

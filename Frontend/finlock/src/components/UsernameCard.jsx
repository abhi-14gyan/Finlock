import { useState } from "react";
import axios from "../utils/axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"; // for navigation

export default function UsernameCard({ onClose }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // react-router navigation

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "/api/v1/users/update-username",
        { username },
        { withCredentials: true }
      );
      toast.success("✅ Username updated!");
      onClose(); // close the modal
      navigate("/dashboard"); // redirect
      setTimeout(() => {
        window.location.reload(); // refresh after short delay
      }, 300);
    } catch (error) {
      setMessage("❌ Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl shadow-xl w-96">
      <h2 className="text-xl font-bold mb-4">Edit Username</h2>
      <input
        type="text"
        placeholder="Enter new username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 dark:bg-gray-800"
      />
      <div className="flex justify-between items-center">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}

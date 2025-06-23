import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const AccountDropdown = ({ accountId, onDeleteSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/v1/dashboard/accounts/${accountId}`);
      setIsOpen(false);
      setConfirmOpen(false);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setConfirmOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-1 hover:bg-gray-100 rounded text-gray-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div onClick={(e) => e.stopPropagation()}  className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50 text-sm">
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full px-4 py-2 hover:bg-red-100 text-left text-red-600"
          >
            Delete
          </button>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmOpen && (
        <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-14 w-64 bg-white border border-gray-300 rounded shadow-md p-4 z-50">
          <p className="text-sm mb-3 text-gray-700">
            Are you sure you want to delete this account?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

const TransactionDropdown = ({ transaction, deleteFn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleEdit = () => {
    navigate(`/transaction/?edit=${transaction._id}`);
    setIsOpen(false);
  };

  const handleDelete = () => {
    deleteFn([transaction.id]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
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
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50 text-sm">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
          >
            Edit
          </button>
          <div className="border-t" />
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 hover:bg-red-100 text-left text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionDropdown;

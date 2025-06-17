import { useRef, useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import axios from "axios";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post("/api/v1/transaction/scan-receipt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // or however you store your JWT
        },
      });

      if (res.data) {
        toast.success("Receipt scanned successfully");
        onScanComplete(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to scan receipt. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
  <input
    type="file"
    ref={fileInputRef}
    className="hidden"
    accept="image/*"
    capture="environment"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) handleReceiptScan(file);
    }}
  />

  <button
    type="button"
    className="flex items-center justify-center w-full h-10 px-4 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white rounded-md hover:opacity-90 transition-opacity"
    onClick={() => fileInputRef.current?.click()}
    disabled={loading}
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <span>Scanning Receipt...</span>
      </>
    ) : (
      <>
        <Camera className="w-4 h-4 mr-2" />
        <span>Scan Receipt with AI</span>
      </>
    )}
  </button>
</div>

  );
}

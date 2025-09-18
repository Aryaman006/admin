"use client";
import { useState, useEffect } from "react";

export default function Modal({ open, onClose, onSave, initialValue = "", title = "Edit" }) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue || "");
  }, [initialValue]);

  if (!open) return null;

  const handleSave = () => {
    if (inputValue.trim() === "") return;
    onSave(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl relative animate-slideDown">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">{title}</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter ${title}`}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setInputValue("");
              onClose();
            }}
            className="px-5 py-2 border rounded-full hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md"
          >
            Save
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

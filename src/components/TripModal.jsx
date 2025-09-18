"use client";
import { useState, useEffect } from "react";

export default function TripModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    items: "",
    weight: "",
    manager: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        origin: "",
        destination: "",
        items: "",
        weight: "",
        manager: "",
      });
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // optional: validate fields
    if (
      !formData.origin.trim() ||
      !formData.destination.trim() ||
      !formData.items.trim() ||
      !formData.weight.trim() ||
      !formData.manager.trim()
    )
      return;

    onSave(formData);
    setFormData({
      origin: "",
      destination: "",
      items: "",
      weight: "",
      manager: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl relative animate-slideDown">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          {initialData ? "Edit Trip" : "Add Trip"}
        </h2>

        {/* Inputs */}
        {[
          { label: "Origin", name: "origin", placeholder: "e.g., Chennai" },
          { label: "Destination", name: "destination", placeholder: "e.g., HQ / Rice Mill" },
          { label: "Items", name: "items", placeholder: "e.g., Paddy" },
          { label: "Weight", name: "weight", placeholder: "e.g., 200 kg" },
          { label: "Manager Name", name: "manager", placeholder: "e.g., Aryaman" },
        ].map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
          />
        ))}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              setFormData({
                origin: "",
                destination: "",
                items: "",
                weight: "",
                manager: "",
              });
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
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "@/redux/slices/locationsSlice";
import { fetchItems } from "@/redux/slices/itemsSlice";
import { fetchManagers } from "@/redux/slices/managersSlice";

export default function TripModal({ open, onClose, onSave, initialData }) {
  const dispatch = useDispatch();

  // fetch dropdown data from backend
  useEffect(() => {
    dispatch(fetchLocations());
    dispatch(fetchItems());
    dispatch(fetchManagers());
  }, [dispatch]);

  const { list: locations } = useSelector((state) => state.locations);
  const { list: items } = useSelector((state) => state.items);
  const { list: managers } = useSelector((state) => state.managers);

  const [formData, setFormData] = useState(
    initialData || {
      origin: "",
      destination: "",
      material: "",
      weight: "",
      manager: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        origin: initialData.source?.location?._id || "",
        destination: initialData.destination?.location?._id || "",
        material: initialData.material?._id || "",
        weight: initialData.quantity?.net || "",
        manager: initialData.driver?._id || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare payload in API format
    const payload = {
      vehicle: "replace-with-vehicle-id", // 🚨 TODO: hook up vehicle API
      driver: formData.manager,
      material: formData.material,
      quantity: {
        net: Number(formData.weight),
        unit: "kg", // you can make this dynamic if needed
      },
      source: { location: formData.origin },
      destination: { location: formData.destination },
      type: "inbound", // or outbound, can make this selectable
    };

    onSave(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Trip" : "Add Trip"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Origin
            </label>
            <select
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              required
            >
              <option value="">Select Origin</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              required
            >
              <option value="">Select Destination</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Material (Item) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item (Material)
            </label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              required
            >
              <option value="">Select Item</option>
              {items.map((mat) => (
                <option key={mat._id} value={mat._id}>
                  {mat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              required
            />
          </div>

          {/* Manager (Driver) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manager (Driver)
            </label>
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              required
            >
              <option value="">Select Manager</option>
              {managers.map((drv) => (
                <option key={drv._id} value={drv._id}>
                  {drv.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { addLocation, editLocation, deleteLocation } from "@/redux/slices/locationsSlice";
import { useState } from "react";

export default function LocationPage() {
  const locations = useSelector((state) => state.locations.locations);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleAdd = () => {
    setCurrentIndex(null);
    setOpenModal(true);
  };

  const handleEdit = (index) => {
    setCurrentIndex(index);
    setOpenModal(true);
  };

  const handleSave = (name) => {
    if (!name.trim()) return;

    if (currentIndex !== null) {
      const id = locations[currentIndex].id;
      dispatch(editLocation({ id, name: name.trim() }));
    } else {
      dispatch(addLocation(name.trim()));
    }
    setOpenModal(false);
  };

  const handleDelete = (index) => {
    const id = locations[index].id;
    dispatch(deleteLocation(id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow-md transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Location
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-700 text-sm">
                Location Name
              </th>
              <th className="px-6 py-4 text-right font-medium text-gray-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc, i) => (
              <tr key={loc.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-800">{loc.name}</td>
                <td className="px-6 py-3 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(i)}
                    className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        initialValue={currentIndex !== null ? locations[currentIndex].name : ""}
        title={currentIndex !== null ? "Edit Location" : "Add Location"}
      />
    </div>
  );
}

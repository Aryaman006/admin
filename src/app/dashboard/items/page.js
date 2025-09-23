"use client";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItem, editItem, deleteItem } from "@/redux/slices/itemsSlice";

export default function ItemsPage() {
  const items = useSelector((state) => state.items.items) || []; // default to empty array
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleAdd = () => {
    setCurrentItem(null);
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setOpenModal(true);
  };

  const handleSave = (name) => {
    if (!name.trim()) return;

    if (currentItem) {
      dispatch(editItem({ id: currentItem.id, name: name.trim() }));
    } else {
      dispatch(addItem(name.trim()));
    }

    setOpenModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 tracking-tight">
          Items Management
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm md:text-base px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
          Add Item
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow bg-white">
        {items.length > 0 ? (
          <table className="min-w-full border-collapse text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-normal tracking-wide">Item Name</th>
                <th className="px-6 py-3 text-right font-normal tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr
                  key={i.id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-3 font-light">{i.name}</td>
                  <td className="px-6 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-150"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition duration-150"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">No items available.</div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {items.length > 0 ? (
          items.map((i) => (
            <div
              key={i.id}
              className="p-4 bg-white shadow rounded-xl flex justify-between items-center transition-transform duration-150 hover:scale-[1.02]"
            >
              <span className="text-gray-800 font-light text-base">{i.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-150"
                  title="Edit Item"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(i.id)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition duration-150"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No items available.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        initialValue={currentItem ? currentItem.name : ""}
        title={currentItem ? "Edit Item" : "Add New Item"}
      />
    </div>
  );
}

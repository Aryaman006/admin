"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import TripModal from "@/components/TripModal";
import { fetchTrips, addTrip, editTrip, deleteTrip } from "@/redux/slices/tripsSlice";

export default function TripsPage() {
  const { trips, loading, error } = useSelector((state) => state.trips);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  useEffect(() => {
    dispatch(fetchTrips());
    // const token = getState().auth.user?.token;
    // console.log(token);
    
  }, [dispatch]);

  const openAddModal = () => {
    setCurrentTrip(null);
    setIsOpen(true);
  };

  const openEditModal = (trip) => {
    setCurrentTrip(trip);
    setIsOpen(true);
  };

  const handleSave = (data) => {
    if (currentTrip) {
      dispatch(editTrip({ id: currentTrip._id, updatedTrip: data }));
    } else {
      dispatch(addTrip(data));
    }
    setIsOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteTrip(id));
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 tracking-tight">
          Trips Management
        </h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Add Trip
        </button>
      </div>

      {loading && <p>Loading trips...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow bg-white">
        <table className="min-w-full border-collapse text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Origin</th>
              <th className="px-6 py-3 text-left">Destination</th>
              <th className="px-6 py-3 text-left">Items</th>
              <th className="px-6 py-3 text-left">Weight</th>
              <th className="px-6 py-3 text-left">Manager (Driver)</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{t.source?.customLocation || t.source?.location?.name}</td>
                <td className="px-6 py-3">{t.destination?.customLocation || t.destination?.location?.name}</td>
                <td className="px-6 py-3">{t.material?.name}</td>
                <td className="px-6 py-3">{t.quantity?.net} {t.quantity?.unit}</td>
                <td className="px-6 py-3">{t.driver?.name}</td>
                <td className="px-6 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TripModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        initialData={currentTrip}
      />
    </div>
  );
}

"use client";
import { useSelector } from "react-redux";
import { Package, MapPin, Truck, Users } from "lucide-react";
import TripsChart from "@/components/Chart";

export default function DashboardPage() {
  // ✅ Default empty arrays to avoid crashes if slices are not ready
  const items = useSelector((state) => state.items.list) || [];
  const locations = useSelector((state) => state.locations.list) || [];
  const trips = useSelector((state) => state.trips.trips) || [];
  const managers = useSelector((state) => state.managers.list) || [];

  // ✅ Aggregate trips per manager per item for chart
  const tripsPerManager = managers.length
    ? managers.map((manager) => {
        const managerTrips = trips.filter((t) => t.driver?._id === manager._id);

        const itemWeights = {};
        managerTrips.forEach((t) => {
          const itemName = t.material?.name || "Unknown";
          if (!itemWeights[itemName]) itemWeights[itemName] = 0;
          itemWeights[itemName] += Number(t.quantity?.net || 0);
        });

        return { manager: manager.name, ...itemWeights };
      })
    : [];

  // ✅ Determine all unique item types for stacked bars
  const allItems = [...new Set(trips.map((t) => t.material?.name))];

  // ✅ Show recent trips (latest 5)
  const recentTrips = trips.slice(-5).reverse();

  // ✅ Stats
  const stats = [
    { label: "Total Items", value: items.length, icon: <Package className="w-6 h-6 text-blue-600" /> },
    { label: "Total Locations", value: locations.length, icon: <MapPin className="w-6 h-6 text-green-600" /> },
    { label: "Active Trips", value: trips.length, icon: <Truck className="w-6 h-6 text-orange-600" /> },
    { label: "Managers", value: managers.length, icon: <Users className="w-6 h-6 text-purple-600" /> },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* ✅ Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-xl font-semibold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Recent Trips + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Trips</h2>
          </div>

          {trips.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              No trips available yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600 font-medium">Origin</th>
                  <th className="px-6 py-3 text-left text-gray-600 font-medium">Destination</th>
                  <th className="px-6 py-3 text-left text-gray-600 font-medium">Weight</th>
                  <th className="px-6 py-3 text-left text-gray-600 font-medium">Item</th>
                  <th className="px-6 py-3 text-left text-gray-600 font-medium">Manager</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr
                    key={trip._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">
                      {trip.source?.location?.name || trip.source?.customLocation}
                    </td>
                    <td className="px-6 py-3">
                      {trip.destination?.location?.name || trip.destination?.customLocation}
                    </td>
                    <td className="px-6 py-3">
                      {trip.quantity?.net} {trip.quantity?.unit}
                    </td>
                    <td className="px-6 py-3">{trip.material?.name}</td>
                    <td className="px-6 py-3">{trip.driver?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Trips Overview Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Trips Overview (kg per item)
          </h2>
          {tripsPerManager.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No chart data available yet.
            </div>
          ) : (
            <div className="w-full h-64">
              <TripsChart data={tripsPerManager} items={allItems} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

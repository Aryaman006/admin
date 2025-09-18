"use client";
import { useSelector } from "react-redux";
import { Package, MapPin, Truck, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import TripsChart from "@/components/Chart";

export default function DashboardPage() {
  const items = useSelector((state) => state.items.items);
  const locations = useSelector((state) => state.locations.locations);
  const trips = useSelector((state) => state.trips.trips);
  const managers = useSelector((state) => state.managers.managers);

  // Aggregate trips per manager per item for chart
  const tripsPerManager = managers.map((manager) => {
    const managerTrips = trips.filter((t) => t.manager === manager.name);

    // Calculate weight per item type
    const itemWeights = {};
    managerTrips.forEach((t) => {
      if (!itemWeights[t.items]) itemWeights[t.items] = 0;
      itemWeights[t.items] += Number(t.weight);
    });

    return { manager: manager.name, ...itemWeights };
  });

  // Determine all unique item types for stacked bars
  const allItems = [...new Set(trips.map((t) => t.items))];

  // Show recent trips (latest 5)
  const recentTrips = trips.slice(-5).reverse();

  // Stats
  const stats = [
    { label: "Total Items", value: items.length, icon: <Package className="w-6 h-6 text-blue-600" /> },
    { label: "Total Locations", value: locations.length, icon: <MapPin className="w-6 h-6 text-green-600" /> },
    { label: "Active Trips", value: trips.length, icon: <Truck className="w-6 h-6 text-orange-600" /> },
    { label: "Managers", value: managers.length, icon: <Users className="w-6 h-6 text-purple-600" /> },
  ];

  // Colors for items
  const colors = [
    "#4F46E5",
    "#16A34A",
    "#F59E0B",
    "#DB2777",
    "#14B8A6",
    "#F97316",
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Stats */}
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

      {/* Recent Trips + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Trips</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Origin</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Destination</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Weight (kg)</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Items</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Manager</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-6 py-3">{trip.origin}</td>
                  <td className="px-6 py-3">{trip.destination}</td>
                  <td className="px-6 py-3">{trip.weight}</td>
                  <td className="px-6 py-3">{trip.items}</td>
                  <td className="px-6 py-3">{trip.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trips Overview Chart */}
        {/* <div className=""> */}
          {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">Trips Overview (Items & kg)</h2> */}
          <div className="w-full h-64">
            <TripsChart/>
          </div>
        {/* </div> */}
      </div>
    </div>
  );
}

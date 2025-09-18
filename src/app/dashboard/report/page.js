"use client";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { useMemo } from "react";

export default function ReportsPage() {
  const trips = useSelector((state) => state.trips.trips);
  const managers = useSelector((state) => state.managers.managers);

  // Vibrant color palette
  const colors = [
    "#4F46E5", "#16A34A", "#F59E0B", "#DB2777", "#14B8A6", "#F97316",
    "#8B5CF6", "#EC4899", "#22D3EE", "#F87171", "#10B981", "#FBBF24"
  ];

  const parseWeight = (w) => (w ? Number(w.replace("kg", "").trim()) : 0);

  // --- Summary ---
  const totalTrips = trips.length;
  const totalWeight = trips.reduce((acc, t) => acc + parseWeight(t.weight), 0);
  const activeManagers = [...new Set(trips.map((t) => t.manager))].length;

  // --- Trips by Manager ---
  const tripsByManager = managers.map((mgr) => ({
    manager: mgr.name,
    trips: trips.filter((t) => t.manager === mgr.name).length,
  }));

  // --- Weight Distribution by Item ---
  const items = [...new Set(trips.map((t) => t.items))];
  const weightByItem = items.map((item) => ({
    name: item,
    value: trips
      .filter((t) => t.items === item)
      .reduce((acc, t) => acc + parseWeight(t.weight), 0),
  }));

  // --- Source & Destination Locations ---
  const sourceLocations = [...new Set(trips.map((t) => t.origin))];
  const destLocations = [...new Set(trips.map((t) => t.destination))];

  const tripsBySource = sourceLocations.map((loc) => ({
    location: loc,
    trips: trips.filter((t) => t.origin === loc).length,
  }));

  const tripsByDestination = destLocations.map((loc) => ({
    location: loc,
    trips: trips.filter((t) => t.destination === loc).length,
  }));

  // --- Memoize charts for performance ---
  const renderBarChart = (data, dataKey, fill) => (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="location" tick={{ fill: "#374151", fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey={dataKey} fill={fill} radius={[6, 6, 0, 0]} animationDuration={1500}>
          <LabelList dataKey={dataKey} position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = (data, dataKey, nameKey) => (
    <ResponsiveContainer width="100%" height={256}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={dataKey === "value" ? 50 : 0}
          label={(entry) => `${entry[nameKey]} (${entry[dataKey]})`}
          animationDuration={1500}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => (dataKey === "value" ? `${val} kg` : `${val} trips`)} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Trips</p>
          <h3 className="text-xl font-semibold text-gray-900">{totalTrips}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Managers</p>
          <h3 className="text-xl font-semibold text-gray-900">{activeManagers}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Weight Shipped</p>
          <h3 className="text-xl font-semibold text-gray-900">{totalWeight} kg</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trips by Source</h2>
          {renderBarChart(tripsBySource, "trips", colors[0])}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trips by Destination</h2>
          {renderBarChart(tripsByDestination, "trips", colors[1])}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trips by Manager</h2>
          {renderPieChart(tripsByManager, "trips", "manager")}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weight Distribution by Item</h2>
          {renderPieChart(weightByItem, "value", "name")}
        </div>
      </div>
    </div>
  );
}

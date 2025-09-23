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

export default function ReportsPage() {
  const trips = useSelector((state) => state.trips.trips) || [];
  const managers = useSelector((state) => state.managers.list) || [];

  // 🎨 Vibrant color palette
  const colors = [
    "#4F46E5", "#16A34A", "#F59E0B", "#DB2777", "#14B8A6", "#F97316",
    "#8B5CF6", "#EC4899", "#22D3EE", "#F87171", "#10B981", "#FBBF24"
  ];

  // --- Summary ---
  const totalTrips = trips.length;
  const totalWeight = trips.reduce((acc, t) => acc + Number(t.quantity?.net || 0), 0);
  const activeManagers = [...new Set(trips.map((t) => t.driver?.name).filter(Boolean))].length;

  // --- Trips by Manager ---
  const tripsByManager = managers.map((mgr) => ({
    manager: mgr.name,
    trips: trips.filter((t) => t.driver?._id === mgr._id).length,
  }));

  // --- Weight Distribution by Item ---
  const items = [...new Set(trips.map((t) => t.material?.name).filter(Boolean))];
  const weightByItem = items.map((item) => ({
    name: item,
    value: trips
      .filter((t) => t.material?.name === item)
      .reduce((acc, t) => acc + Number(t.quantity?.net || 0), 0),
  }));

  // --- Source & Destination Locations ---
  const sourceLocations = [...new Set(trips.map((t) => t.source?.location?.name || t.source?.customLocation).filter(Boolean))];
  const destLocations = [...new Set(trips.map((t) => t.destination?.location?.name || t.destination?.customLocation).filter(Boolean))];

  const tripsBySource = sourceLocations.map((loc) => ({
    location: loc,
    trips: trips.filter((t) => (t.source?.location?.name || t.source?.customLocation) === loc).length,
  }));

  const tripsByDestination = destLocations.map((loc) => ({
    location: loc,
    trips: trips.filter((t) => (t.destination?.location?.name || t.destination?.customLocation) === loc).length,
  }));

  // --- Chart Render Helpers ---
  const renderBarChart = (data, dataKey, fill) => (
    data.length === 0 ? (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    ) : (
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
    )
  );

  const renderPieChart = (data, dataKey, nameKey) => (
    data.length === 0 ? (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    ) : (
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
    )
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

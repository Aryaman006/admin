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
  Legend,
  LabelList,
} from "recharts";

export default function TripsChart() {
  const trips = useSelector((state) => state.trips.trips);
  const managers = useSelector((state) => state.managers.managers);

  // Aggregate trips per manager and per item
  const tripsPerManager = managers.map((manager) => {
    const managerTrips = trips.filter((t) => t.manager === manager.name);

    const itemWeights = {};
    let totalWeight = 0;

    managerTrips.forEach((t) => {
      const weightKg = parseFloat(t.weight);
      if (!isNaN(weightKg)) {
        totalWeight += weightKg;
        if (!itemWeights[t.items]) itemWeights[t.items] = 0;
        itemWeights[t.items] += weightKg;
      }
    });

    return { manager: manager.name, ...itemWeights, totalWeight };
  });

  // Get all unique items
  const allItems = [...new Set(trips.map((t) => t.items))];

  // Solid colors for items
  const colors = ["#4F46E5", "#16A34A", "#F59E0B", "#DB2777", "#14B8A6", "#F97316"];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Trips Overview (Items in kg)
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={tripsPerManager}
            margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="manager"
              tick={{ fill: "#374151", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              allowDecimals={false}
              label={{
                value: "kg",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
                fontSize: 12,
              }}
            />
            <Tooltip formatter={(value, name) => [`${value} kg`, name]} />
            <Legend verticalAlign="top" height={36} />

            {allItems.map((item, idx) => (
              <Bar
                key={item}
                dataKey={item}
                stackId="a"
                fill={colors[idx % colors.length]}
                radius={[6, 6, 0, 0]}
                barSize={30}
              >
                <LabelList
                  dataKey={item}
                  position="insideTop"
                  formatter={(val) => (val ? val : "")}
                  fill="#fff"
                  fontSize={12}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

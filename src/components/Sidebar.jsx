"use client";
import Image from "next/image";
import {
  List,
  MapPin,
  BarChart,
  Home,
  Truck,
  UserCog2,
  Menu,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", icon: Home, link: "/dashboard" },
    { name: "Items", icon: List, link: "/dashboard/items" },
    { name: "Trips", icon: Truck, link: "/dashboard/trips" },
    { name: "Managers", icon: UserCog2, link: "/dashboard/managers" },
    { name: "Locations", icon: MapPin, link: "/dashboard/location" },
    { name: "Reports", icon: BarChart, link: "/dashboard/report" },
  ];

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-64"}
        bg-white/95 backdrop-blur-md shadow-xl h-screen
        flex flex-col border-r border-gray-200 transition-all duration-300
      `}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <Image
            src="/logo.png" // keep logo in public/
            alt="Wroots Logo"
            width={collapsed ? 32 : 40}
            height={collapsed ? 32 : 40}
            className="object-contain transition-all"
          />
          {!collapsed && (
            <span className="text-blue-600 font-bold text-lg tracking-wide whitespace-nowrap">
              Krishna & Co
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-6 space-y-1 px-2">
        {menu.map((item, i) => {
          const isActive = pathname === item.link;
          const Icon = item.icon;
          return (
            <li
              key={i}
              onClick={() => router.push(item.link)}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all group
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
            >
              {/* Active blue bar */}
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-md" />
              )}
              <Icon
                size={20}
                className={`transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                }`}
              />
              {!collapsed && <span className="text-sm">{item.name}</span>}

              {/* Tooltip on collapse */}
              {collapsed && (
                <span className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div
        className={`mt-auto text-gray-400 text-xs px-4 py-4 border-t border-gray-100 ${
          collapsed && "text-center"
        }`}
      >
        {!collapsed ? "© 2025 Wroots" : "©"}
      </div>
    </aside>
  );
}

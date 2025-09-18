"use client";
import { useState } from "react";
import { User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user from Redux
  const user = useSelector((state) => state.auth.user);

  // Map URL -> Title
  const titles = {
    "/": "Dashboard",
    "/items": "Items",
    "/trips": "Trips",
    "/location": "Locations",
    "/reports": "Reports",
  };

  const getTitle = () => {
    if (titles[pathname]) return titles[pathname];
    const segment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    // document.cookie = "user=; path=/; max-age=0"; // clear cookie for middleware
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-200">
      {/* Page Title */}
      <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
        {getTitle()}
      </h1>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
        >
          <User size={24} className="text-gray-600" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-fadeIn">
            {/* Profile Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">
                {user?.email?.split("@")[0] || "Guest User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "No email available"}
              </p>
            </div>

            {/* Menu Items */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

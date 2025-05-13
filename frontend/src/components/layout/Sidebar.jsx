import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  LogOut,
} from "lucide-react";
import ogo from "../../assets/ogo.png";
import { adminService } from "../../api/adminService";
import { useToast } from "../ui/Toast";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Organizers", href: "/organizers", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Admins", href: "/admins", icon: UserCog },
  ];

  const handleLogout = async () => {
    try {
      await adminService.logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center">
          <img src={ogo} alt="TechEvents Logo" className="h-10" />
        </Link>
      </div>
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              location.pathname === item.href
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 w-full"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ogo from "../../assets/ogo.png"; // adjust the path as needed

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center gap-2 p-4 bg-white shadow">
      <span className="text-2xl font-bold text-indigo-900"></span>
    </header>
  );
}

export default Layout;

import React, { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Users, Calendar, ClipboardCheck } from "lucide-react";
import { adminService } from "../api/adminService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState({
    totalOrganizers: 0,
    totalEvents: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        approvedOrganizers,
        approvedEvents,
        pendingEvents,
        pendingOrganizers,
      ] = await Promise.all([
        adminService.getApprovedOrganizers(),
        adminService.getApprovedEvents(),
        adminService.getPendingEvents(),
        adminService.getPendingRegistrations(),
      ]);

      setStats({
        totalOrganizers: approvedOrganizers.organizers.length,
        totalEvents: approvedEvents.data.length,
        pendingApprovals:
          pendingEvents.data.length + pendingOrganizers.organizers.length,
      });
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("403")) {
        // If unauthorized, redirect to login
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.message);
        addToast({
          title: "Error",
          description: err.message || "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Line chart data
  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Events",
        data: [
          stats.totalEvents,
          stats.totalEvents + 2,
          stats.totalEvents + 4,
          stats.totalEvents + 3,
          stats.totalEvents + 5,
          stats.totalEvents + 6,
          stats.totalEvents + 7,
        ],
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        tension: 0.4,
      },
      {
        label: "Organizers",
        data: [
          stats.totalOrganizers,
          stats.totalOrganizers + 1,
          stats.totalOrganizers + 2,
          stats.totalOrganizers + 3,
          stats.totalOrganizers + 4,
          stats.totalOrganizers + 5,
          stats.totalOrganizers + 6,
        ],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Pending Approvals",
        data: [
          stats.pendingApprovals,
          stats.pendingApprovals - 1,
          stats.pendingApprovals - 2,
          stats.pendingApprovals - 1,
          stats.pendingApprovals - 3,
          stats.pendingApprovals - 2,
          stats.pendingApprovals - 1,
        ],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Doughnut chart data
  const doughnutChartData = {
    labels: ["Events", "Organizers", "Pending"],
    datasets: [
      {
        data: [
          stats.totalEvents,
          stats.totalOrganizers,
          stats.pendingApprovals,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.2)",
          "rgba(74, 222, 128, 0.2)",
          "rgba(236, 72, 153, 0.2)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(74, 222, 128, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-indigo-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Total Organizers
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalOrganizers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Total Events
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalEvents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Pending Approvals
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingApprovals}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Overview
          </h2>
          <div className="h-[300px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Distribution
          </h2>
          <div className="h-[300px]">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/organizers-submission")}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ClipboardCheck className="h-5 w-5 text-indigo-600 mr-2" />
            <span>Review Organizer Submissions</span>
          </button>
          <button
            onClick={() => navigate("/events-submission")}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
            <span>Review Event Submissions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

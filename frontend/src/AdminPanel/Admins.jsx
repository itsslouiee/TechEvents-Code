import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AdminsGrid from "../components/tables/AdminsGrid";
import Input from "../components/ui/Input";
import { adminService } from "../api/adminService";
import { useToast } from "../components/ui/Toast";

function Admins() {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdmins();
      const mappedData = response.admins.map((admin) => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
      }));
      setAdmins(mappedData);
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch admins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-900">Admins</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search"
            className="w-64 pl-8 rounded-md border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <AdminsGrid data={filteredAdmins} />
        )}
      </div>
    </div>
  );
}

export default Admins;

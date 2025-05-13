import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import OrganizersTable from "../components/tables/OrganizersTable";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { adminService } from "../api/adminService";
import { useToast } from "../components/ui/Toast";

function Organizers() {
  const [search, setSearch] = useState("");
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getApprovedOrganizers();
      const mappedData = response.organizers.map((org) => ({
        id: org._id,
        name: org.organizationName,
        email: org.email,
        location: org.location || "N/A",
        logo: org.logo,
        date: new Date(org.updatedAt).toLocaleDateString(),
      }));
      setOrganizers(mappedData);
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch organizers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const filteredOrganizers = organizers.filter(
    (organizer) =>
      organizer.name.toLowerCase().includes(search.toLowerCase()) ||
      organizer.email.toLowerCase().includes(search.toLowerCase()) ||
      organizer.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-900">Organizers</h1>
        <div className="flex items-center gap-2">
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
          <Link to="/organizers-submission">
            <Button variant="link" className="text-indigo-600 font-medium">
              See Submissions
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <OrganizersTable data={filteredOrganizers} />
        )}
      </div>
    </div>
  );
}

export default Organizers;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import OrganizersSubmissionTable from "../components/tables/OrganizersSubmissionTable";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { adminService } from "../api/adminService";
import { useToast } from "../components/ui/Toast";

function OrganizersSubmission() {
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      console.log("Fetching pending registrations..."); // Debug log
      const response = await adminService.getPendingRegistrations();
      console.log("API Response:", response); // Debug log

      if (response && response.organizers) {
        console.log("Processing organizers:", response.organizers); // Debug log
        const mappedData = response.organizers.map((org) => {
          console.log("Processing organizer:", org); // Debug log
          return {
            id: org._id,
            name: org.organizationName,
            email: org.email,
            location: org.location || "N/A",
            date: new Date(org.createdAt).toLocaleDateString(),
            documentUrl: org.verificationDoc,
            status: org.status,
          };
        });
        console.log("Mapped data:", mappedData); // Debug log
        setSubmissions(mappedData);
      } else {
        console.error("Invalid response format:", response);
        addToast({
          title: "Error",
          description: "Invalid response format from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Component mounted, fetching submissions..."); // Debug log
    fetchSubmissions();
  }, []);

  const handleApprove = async (id) => {
    try {
      console.log("Approving organizer:", id); // Debug log
      await adminService.approveRegistration(id);
      await fetchSubmissions(); // Refresh the list
      addToast({
        title: "Success",
        description: "Organizer approved successfully",
      });
    } catch (error) {
      console.error("Error approving organizer:", error);
      addToast({
        title: "Error",
        description: error.message || "Failed to approve organizer",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      console.log("Rejecting organizer:", id); // Debug log
      await adminService.rejectRegistration(id);
      await fetchSubmissions(); // Refresh the list
      addToast({
        title: "Success",
        description: "Organizer rejected successfully",
      });
    } catch (error) {
      console.error("Error rejecting organizer:", error);
      addToast({
        title: "Error",
        description: error.message || "Failed to reject organizer",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.name.toLowerCase().includes(search.toLowerCase()) ||
      submission.email.toLowerCase().includes(search.toLowerCase()) ||
      submission.location.toLowerCase().includes(search.toLowerCase()) ||
      submission.date.includes(search)
  );

  console.log("Current submissions:", submissions); // Debug log
  console.log("Filtered submissions:", filteredSubmissions); // Debug log

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-900">
          Organizers Submission
        </h1>
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
          <Link to="/organizers">
            <Button variant="link" className="text-indigo-600 font-medium">
              See all Organizers
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending submissions found
          </div>
        ) : (
          <OrganizersSubmissionTable
            data={filteredSubmissions}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}

export default OrganizersSubmission;

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import EventsSubmissionTable from "../components/tables/EventsSubmissionTable";
import { adminService } from "../api/adminService";
import { useToast } from "../components/ui/Toast";
import debounce from "lodash/debounce";

function EventsSubmission() {
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchSubmissions = async (searchQuery = "") => {
    try {
      setLoading(true);
      let response;
      if (searchQuery) {
        response = await adminService.searchEvents(searchQuery);
      } else {
        response = await adminService.getPendingEvents();
      }

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch event submissions"
        );
      }

      const mappedSubmissions = response.data.map((submission) => ({
        _id: submission._id,
        eventName: submission.eventName,
        category: submission.category,
        logo: submission.logo,
        locationType: submission.locationType,
        city: submission.city,
        startDate: submission.startDate
          ? new Date(submission.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Not specified",
        endDate: submission.endDate
          ? new Date(submission.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        organizerId: submission.organizerId,
      }));

      setSubmissions(mappedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch event submissions",
        status: "error",
      });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchSubmissions(query);
    }, 500),
    []
  );

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    } else {
      fetchSubmissions();
    }
  }, [search]);

  const handleSubmissionUpdated = (updatedId) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.filter((submission) => submission._id !== updatedId)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-900">
          Events Submission
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="search"
              placeholder="Search submissions..."
              className="w-64 pl-9 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            to="/events"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            See all Events
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <EventsSubmissionTable
            submissions={submissions}
            onSubmissionUpdated={handleSubmissionUpdated}
          />
        )}
      </div>
    </div>
  );
}

export default EventsSubmission;

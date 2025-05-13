import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import EventsTable from "../components/tables/EventsTable";
import { adminService } from "../api/adminService";
import { useToast } from "../components/ui/Toast";
import debounce from "lodash/debounce";

function Events() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchEvents = async (searchQuery = "") => {
    try {
      setLoading(true);
      let response;
      if (searchQuery) {
        response = await adminService.searchEvents(searchQuery);
      } else {
        response = await adminService.getApprovedEvents();
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch events");
      }

      const mappedEvents = response.data.map((event) => ({
        _id: event._id,
        eventName: event.eventName,
        category: event.category,
        logo: event.logo,
        locationType: event.locationType,
        city: event.city,
        startDate: event.startDate
          ? new Date(event.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Not specified",
        endDate: event.endDate
          ? new Date(event.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        organizerId: event.organizerId,
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch events",
        status: "error",
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchEvents(query);
    }, 500),
    []
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    } else {
      fetchEvents();
    }
  }, [search]);

  const handleEventDeleted = (deletedId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event._id !== deletedId)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-900">Events</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="search"
              placeholder="Search events..."
              className="w-64 pl-9 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            to="/events-submission"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            See Submissions
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <EventsTable events={events} onEventDeleted={handleEventDeleted} />
        )}
      </div>
    </div>
  );
}

export default Events;

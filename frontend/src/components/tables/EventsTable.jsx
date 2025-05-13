import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import { adminService } from "../../api/adminService";

const EventsTable = ({ events, onEventDeleted }) => {
  const [processingId, setProcessingId] = useState(null);
  const { addToast } = useToast();

  const handleDelete = async (id) => {
    try {
      setProcessingId(id);
      const response = await adminService.deleteEvent(id);

      if (response.data.success) {
        addToast({
          title: "Success",
          description: response.data.message || "Event deleted successfully",
          status: "success",
        });
        onEventDeleted(id);
      } else {
        throw new Error(response.data.error || "Failed to delete event");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete event",
        status: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getLocation = (event) => {
    if (!event) return "Not specified";

    if (event.locationType === "Online") {
      return "Online";
    }

    if (event.locationType === "Onsite" && event.city) {
      return event.city;
    }

    return "Not specified";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {event.logo && (
                    <img
                      src={event.logo}
                      alt={event.eventName}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900">
                    {event.eventName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{event.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {getLocation(event)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{event.startDate}</div>
                {event.endDate && (
                  <div className="text-xs text-gray-500">
                    to {event.endDate}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <button
                  onClick={() => handleDelete(event._id)}
                  disabled={processingId === event._id}
                  className={`px-3 py-2 rounded-md text-white font-medium transition-colors ${
                    processingId === event._id
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {processingId === event._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;

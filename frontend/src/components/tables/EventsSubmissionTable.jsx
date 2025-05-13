import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import { adminService } from "../../api/adminService";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";

const EventsSubmissionTable = ({ submissions, onSubmissionUpdated }) => {
  const [processingId, setProcessingId] = useState(null);
  const { addToast } = useToast();

  const handleApprove = async (id) => {
    try {
      setProcessingId(`approve-${id}`);
      const response = await adminService.approveEvent(id);

      if (response.data.success) {
        addToast({
          title: "Success",
          description: response.data.message || "Event approved successfully",
          status: "success",
        });
        onSubmissionUpdated(id);
      } else {
        throw new Error(response.data.error || "Failed to approve event");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to approve event",
        status: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(`reject-${id}`);
      const response = await adminService.rejectEvent(id);

      if (response.data.success) {
        addToast({
          title: "Success",
          description: response.data.message || "Event rejected successfully",
          status: "success",
        });
        onSubmissionUpdated(id);
      } else {
        throw new Error(response.data.error || "Failed to reject event");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to reject event",
        status: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getLocation = (submission) => {
    if (!submission) return "Not specified";

    if (submission.locationType === "Online") {
      return "Online";
    }

    if (submission.locationType === "Onsite" && submission.city) {
      return submission.city;
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
              Organization
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
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {submission.logo && (
                    <img
                      src={submission.logo}
                      alt={submission.eventName}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900">
                    {submission.eventName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {submission.organizerId?.organizationName || "Not specified"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {submission.category}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {getLocation(submission)}
                </div>
                {submission.organizerName && (
                  <div className="text-xs text-gray-500">
                    Organizer: {submission.organizerName}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {submission.startDate}
                </div>
                {submission.endDate && (
                  <div className="text-xs text-gray-500">
                    to {submission.endDate}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button
                  onClick={() => handleApprove(submission._id)}
                  disabled={
                    processingId === `approve-${submission._id}` ||
                    processingId === `reject-${submission._id}`
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {processingId === `approve-${submission._id}` ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  onClick={() => handleReject(submission._id)}
                  disabled={
                    processingId === `approve-${submission._id}` ||
                    processingId === `reject-${submission._id}`
                  }
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {processingId === `reject-${submission._id}` ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Reject"
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsSubmissionTable;

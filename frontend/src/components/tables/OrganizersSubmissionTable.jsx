import React, { useState } from "react";
import { FileText, Loader2, Eye } from "lucide-react";
import Button from "../ui/Button";
import { useToast } from "../ui/Toast";

function OrganizersSubmissionTable({ data, onApprove, onReject }) {
  const { addToast } = useToast();
  const [processingId, setProcessingId] = useState(null);

  // Handle approve submission
  const handleApprove = async (id) => {
    try {
      setProcessingId(`approve-${id}`);
      await onApprove(id);
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to approve submission",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject submission
  const handleReject = async (id) => {
    try {
      setProcessingId(`reject-${id}`);
      await onReject(id);
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to reject submission",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle document preview
  const handleDocumentPreview = (url) => {
    if (!url) {
      addToast({
        title: "Error",
        description: "No document available",
        variant: "destructive",
      });
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b">
        <div className="font-medium text-gray-500">Name</div>
        <div className="font-medium text-gray-500">Email</div>
        <div className="font-medium text-gray-500">Location</div>
        <div className="font-medium text-gray-500">Date</div>
        <div className="font-medium text-gray-500">Document</div>
        <div className="font-medium text-gray-500">Actions</div>
      </div>
      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No submissions found
        </div>
      ) : (
        <div className="divide-y">
          {data.map((submission) => (
            <div
              key={submission.id}
              className="grid grid-cols-6 gap-4 p-4 items-center"
            >
              <div className="font-medium truncate">{submission.name}</div>
              <div className="text-gray-600 truncate">{submission.email}</div>
              <div className="text-gray-600 truncate">
                {submission.location}
              </div>
              <div className="text-gray-600">{submission.date}</div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-indigo-600 hover:text-indigo-700"
                  onClick={() => handleDocumentPreview(submission.documentUrl)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(submission.id)}
                  disabled={
                    processingId === `approve-${submission.id}` ||
                    processingId === `reject-${submission.id}`
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {processingId === `approve-${submission.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  onClick={() => handleReject(submission.id)}
                  disabled={
                    processingId === `approve-${submission.id}` ||
                    processingId === `reject-${submission.id}`
                  }
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {processingId === `reject-${submission.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Reject"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizersSubmissionTable;

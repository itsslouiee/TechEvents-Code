import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { useToast } from "../ui/Toast";
import { adminService } from "../../api/adminService";

function OrganizersTable({ data }) {
  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState(null);
  const [organizers, setOrganizers] = useState(data);

  React.useEffect(() => {
    setOrganizers(data);
  }, [data]);

  // Handle delete organizer
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await adminService.deleteOrganizer(id);

      // Remove organizer from state
      setOrganizers((prevOrganizers) =>
        prevOrganizers.filter((org) => org.id !== id)
      );

      addToast({
        title: "Success",
        description: "Organizer deleted successfully",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete organizer",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
        <div className="font-medium text-gray-500">Organization</div>
        <div className="font-medium text-gray-500">Email</div>
        <div className="font-medium text-gray-500">Location</div>
        <div className="font-medium text-gray-500">Date</div>
        <div className="font-medium text-gray-500">Actions</div>
      </div>
      {organizers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No organizers found</div>
      ) : (
        <div className="divide-y">
          {organizers.map((organizer) => (
            <div
              key={organizer.id}
              className="grid grid-cols-5 gap-4 p-4 items-center"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 flex-shrink-0 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                  {organizer.logo ? (
                    <img
                      src={organizer.logo}
                      alt={organizer.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.parentElement.classList.add("bg-blue-500");
                        e.target.parentElement.innerHTML = `<span class="text-xs text-white">${organizer.name.charAt(
                          0
                        )}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-xs text-white">
                      {organizer.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="font-medium truncate">{organizer.name}</span>
              </div>
              <div className="text-gray-600 truncate">{organizer.email}</div>
              <div className="text-gray-600 truncate">{organizer.location}</div>
              <div className="text-gray-600">{organizer.date}</div>
              <div>
                <Button
                  onClick={() => handleDelete(organizer.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={deletingId === organizer.id}
                >
                  {deletingId === organizer.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
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

export default OrganizersTable;

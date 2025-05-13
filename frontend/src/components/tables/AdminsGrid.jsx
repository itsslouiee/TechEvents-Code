import React from "react";
import { Mail } from "lucide-react";
import Avatar from "../ui/Avatar";

function AdminsGrid() {
  const admins = [
    {
      id: 1,
      name: "Anfel Benatmane",
      email: "a_benatmane@estin.dz",
      image: null,
    },
    {
      id: 2,
      name: "Louisa Hadji",
      email: "l_hadji@estin.dz",
      image: null,
    },
    {
      id: 3,
      name: "Sarah Ibsaine",
      email: "s_ibsaine@estin.dz",
      image: null,
    },
    {
      id: 4,
      name: "Sami Mahdadi",
      email: "s_mahdadi@estin.dz",
      image: null,
    },
    {
      id: 5,
      name: "Souhaib Abdelouakil Faci",
      email: "s_faci@estin.dz",
      image: null,
    },
    {
      id: 6,
      name: "Billal Brahami",
      email: "b_brahami@estin.dz",
      image: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="bg-white rounded-lg p-6 shadow flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <Avatar className="w-full h-full bg-indigo-500 text-white flex items-center justify-center text-xl">
              {admin.name.charAt(0)}
            </Avatar>
          </div>
          <h3 className="text-lg font-bold mb-1">{admin.name}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Mail className="h-4 w-4 mr-1" />
            <span>{admin.email}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminsGrid;

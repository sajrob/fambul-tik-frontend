// src/components/MemberList.jsx

import React, { useState, useEffect } from "react";
import EditMemberForm from "./EditMemberForm"; // We will create this component next!

// Utility function to calculate age
const calculateAge = (dob, dod = null) => {
  const birthDate = new Date(dob);
  const endDate = dod ? new Date(dod) : new Date(); // Use DOD if provided, else current date

  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = endDate.getMonth() - birthDate.getMonth();

  // Adjust age if birth month/day hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && endDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(""); // State for delete operation feedback
  const [isDeleteError, setIsDeleteError] = useState(false); // State for delete error status
  const [editingMember, setEditingMember] = useState(null); // New state to hold member being edited

  // Function to re-fetch members, useful after add/edit/delete operations
  const refreshMembers = async () => {
    setLoading(true); // Set loading true while re-fetching
    setError(null); // Clear any previous errors
    setDeleteMessage(""); // Clear delete message on refresh
    setIsDeleteError(false); // Clear delete error on refresh

    try {
      const response = await fetch("http://localhost:5000/api/members");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMembers(); // Initial fetch
  }, []); // Empty array means this runs once on mount

  // --- New handleDelete function (updated to use refreshMembers) ---
  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    setDeleteMessage("");
    setIsDeleteError(false);

    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Member deleted successfully:", result);
        // Instead of filtering, we can re-fetch to ensure consistency (especially with relationships later)
        await refreshMembers(); // Re-fetch all members after successful delete
        setDeleteMessage("Member deleted successfully!");
        setIsDeleteError(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete member:", errorData);
        setDeleteMessage(
          `Error: ${errorData.error || "Failed to delete member."}`
        );
        setIsDeleteError(true);
      }
    } catch (err) {
      console.error("Network or other error during delete:", err);
      setDeleteMessage("Network error or server unreachable during delete.");
      setIsDeleteError(true);
    }
  };
  // --- End handleDelete function ---

  // --- New handleEdit function ---
  const handleEdit = (member) => {
    setEditingMember(member); // Set the member to be edited
  };

  // Callback function to close the edit form
  const handleEditCancel = () => {
    setEditingMember(null); // Clear editing member to hide the form
  };

  // Callback function for successful edit
  const handleEditSuccess = () => {
    setEditingMember(null); // Close the form
    refreshMembers(); // Re-fetch the list to show updated data
    // Optionally set a success message here for the MemberList component
  };
  // --- End handleEdit function ---

  if (loading) {
    return <div className="text-center p-4">Loading members...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Family Members
      </h2>

      {/* Delete message display area */}
      {deleteMessage && (
        <div
          className={`p-3 rounded-md text-center ${
            isDeleteError
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {deleteMessage}
        </div>
      )}

      {/* Conditionally render the EditMemberForm */}
      {editingMember && (
        <EditMemberForm
          memberToEdit={editingMember}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      )}

      {!editingMember && members.length === 0 && (
        <div className="text-center p-4 text-gray-600">
          No members added yet.
        </div>
      )}

      {/* Only show list if not editing and there are members */}
      {!editingMember && members.length > 0 && (
        <ul className="space-y-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {member.first_name}{" "}
                  {member.middle_name ? member.middle_name + " " : ""}
                  {member.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(member.dob).getFullYear()} -{" "}
                  {member.is_alive
                    ? "Present"
                    : new Date(member.dod).getFullYear()}
                </p>
                <p className="text-sm text-gray-600">
                  Age:{" "}
                  {calculateAge(
                    member.dob,
                    member.is_alive ? null : member.dod
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                {" "}
                {/* Container for buttons */}
                {/* Edit button */}
                <button
                  onClick={() => handleEdit(member)} // Pass the full member object to the handler
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Edit
                </button>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MemberList;

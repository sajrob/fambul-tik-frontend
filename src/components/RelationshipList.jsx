// src/components/RelationshipList.jsx

import React, { useState, useEffect } from "react";
import EditRelationshipForm from "./EditRelationshipForm"; // Import the new Edit form

function RelationshipList({ refreshTrigger, onRelationshipDeleted }) {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null); // New state for editing

  useEffect(() => {
    const fetchRelationships = async () => {
      setMessage("");
      setIsError(false);
      try {
        const response = await fetch("http://localhost:5000/api/relationships");
        if (!response.ok) {
          throw new Error(`Failed to fetch relationships: ${response.status}`);
        }
        const data = await response.json();
        setRelationships(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching relationships:", err);
        setMessage(`Error fetching relationships: ${err.message}`);
        setIsError(true);
      }
    };

    fetchRelationships();
  }, [refreshTrigger, editingRelationship]); // Also re-fetch if editingRelationship changes (after an update)

  const handleDelete = async (id) => {
    setMessage("");
    setIsError(false);
    if (window.confirm("Are you sure you want to delete this relationship?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/relationships/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const result = await response.json();
          setMessage(`Relationship deleted: ${result.message}`);
          setIsError(false);
          // Trigger a refresh of the list in App.jsx
          if (onRelationshipDeleted) {
            onRelationshipDeleted();
          }
        } else {
          const errorData = await response.json();
          console.error("Failed to delete relationship:", errorData);
          setMessage(
            `Error: ${errorData.error || "Failed to delete relationship."}`
          );
          setIsError(true);
        }
      } catch (err) {
        console.error(
          "Network or other error during relationship deletion:",
          err
        );
        setMessage("Network error or server unreachable during deletion.");
        setIsError(true);
      }
    }
  };

  // Handler for when an edit operation is initiated
  const handleEdit = (relationship) => {
    setEditingRelationship(relationship); // Set the relationship data to be edited
  };

  // Handler for when a relationship is updated
  const handleRelationshipUpdated = () => {
    setEditingRelationship(null); // Hide the edit form
    // Trigger a refresh of the list in App.jsx
    if (onRelationshipDeleted) {
      // Reusing onRelationshipDeleted as a general refresh trigger
      onRelationshipDeleted();
    }
    setMessage("Relationship updated successfully!");
    setIsError(false);
  };

  // Handler for when the edit is cancelled
  const handleCancelEdit = () => {
    setEditingRelationship(null); // Hide the edit form
    setMessage(""); // Clear any messages
    setIsError(false);
  };

  if (loading) {
    return <div className="text-center p-4">Loading relationships...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md border-2 border-green-400">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-4">
        Family Relationships
      </h2>

      {message && (
        <div
          className={`p-3 rounded-md text-center mb-4 ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {editingRelationship ? ( // Conditionally render Edit form or list
        <EditRelationshipForm
          initialRelationshipData={editingRelationship}
          onRelationshipUpdated={handleRelationshipUpdated}
          onCancelEdit={handleCancelEdit}
        />
      ) : relationships.length === 0 ? (
        <div className="text-center p-4 text-gray-600">
          No relationships found yet. Add some above!
        </div>
      ) : (
        <ul className="space-y-3">
          {relationships.map((rel) => (
            <li
              key={rel.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between"
            >
              <p className="text-gray-800 text-lg">
                <span className="font-semibold">
                  {rel.member1_first_name} {rel.member1_last_name}
                </span>{" "}
                is the{" "}
                <span className="font-bold text-blue-700">
                  {rel.relationship_type_name}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {rel.member2_first_name} {rel.member2_last_name}
                </span>
                .
              </p>
              <div className="flex space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(rel)} // Pass the entire relationship object
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(rel.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
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

export default RelationshipList;

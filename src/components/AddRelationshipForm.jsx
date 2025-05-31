// src/components/AddRelationshipForm.jsx

import React, { useState, useEffect } from "react";

function AddRelationshipForm({ onRelationshipAdded }) {
  const [members, setMembers] = useState([]);
  const [relationshipTypes, setRelationshipTypes] = useState([]);
  const [formData, setFormData] = useState({
    member_id_1: "",
    member_id_2: "",
    relationship_type_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Members
        const membersResponse = await fetch(
          "http://localhost:5000/api/members"
        );
        if (!membersResponse.ok) {
          throw new Error(`Failed to fetch members: ${membersResponse.status}`);
        }
        const membersData = await membersResponse.json();
        setMembers(membersData);

        // Fetch Relationship Types
        const typesResponse = await fetch(
          "http://localhost:5000/api/relationship_types"
        );
        if (!typesResponse.ok) {
          throw new Error(
            `Failed to fetch relationship types: ${typesResponse.status}`
          );
        }
        const typesData = await typesResponse.json();
        setRelationshipTypes(typesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data for relationship form:", err);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    // Basic validation: ensure different members are selected
    if (formData.member_id_1 === formData.member_id_2) {
      setMessage(
        "Error: Cannot create a relationship with the same member for both roles."
      );
      setIsError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/relationships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Relationship added successfully!");
        setIsError(false);
        setFormData({
          // Reset form after successful submission
          member_id_1: "",
          member_id_2: "",
          relationship_type_id: "",
        });
        if (onRelationshipAdded) {
          onRelationshipAdded(result); // Callback for parent component to update
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to add relationship:", errorData);
        setMessage(
          `Error: ${errorData.error || "Failed to add relationship."}`
        );
        setIsError(true);
      }
    } catch (err) {
      console.error("Network or other error during relationship add:", err);
      setMessage(
        "Network error or server unreachable during relationship addition."
      );
      setIsError(true);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">Loading relationship form data...</div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border-2 border-purple-400">
      <h2 className="text-2xl font-bold text-purple-800 text-center">
        Add New Relationship
      </h2>

      {message && (
        <div
          className={`p-3 rounded-md text-center ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Member 1 Dropdown */}
        <div>
          <label
            htmlFor="member_id_1"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Member 1:
          </label>
          <select
            id="member_id_1"
            name="member_id_1"
            value={formData.member_id_1}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Member 1</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Member 2 Dropdown */}
        <div>
          <label
            htmlFor="member_id_2"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Member 2:
          </label>
          <select
            id="member_id_2"
            name="member_id_2"
            value={formData.member_id_2}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Member 2</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Relationship Type Dropdown */}
        <div>
          <label
            htmlFor="relationship_type_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Relationship Type:
          </label>
          <select
            id="relationship_type_id"
            name="relationship_type_id"
            value={formData.relationship_type_id}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Relationship Type</option>
            {relationshipTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Relationship
        </button>
      </form>
    </div>
  );
}

export default AddRelationshipForm;

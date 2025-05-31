// src/components/EditMemberForm.jsx

import React, { useState, useEffect } from "react";

// This component receives the member to edit, and callbacks for success/cancel
function EditMemberForm({ memberToEdit, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    dod: null,
    is_alive: true,
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // useEffect to populate the form when memberToEdit changes (i.e., when edit button is clicked)
  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        first_name: memberToEdit.first_name || "",
        middle_name: memberToEdit.middle_name || "",
        last_name: memberToEdit.last_name || "",
        dob: memberToEdit.dob
          ? new Date(memberToEdit.dob).toISOString().split("T")[0]
          : "",
        dod: memberToEdit.dod
          ? new Date(memberToEdit.dod).toISOString().split("T")[0]
          : null,
        is_alive: memberToEdit.is_alive,
      });
      setMessage(""); // Clear messages when a new member is loaded for editing
      setIsError(false);
    }
  }, [memberToEdit]); // Dependency array: run this effect when memberToEdit changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIsAliveChange = (e) => {
    const isChecked = e.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      is_alive: isChecked,
      dod: isChecked ? null : prevFormData.dod, // Reset dod to null if becomes alive
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${memberToEdit.id}`,
        {
          method: "PUT", // This is a PUT request for updating
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Member updated successfully:", result);
        setMessage("Member updated successfully!");
        setIsError(false);
        onSuccess(); // Call the success callback passed from MemberList
      } else {
        const errorData = await response.json();
        console.error("Failed to update member:", errorData);
        setMessage(`Error: ${errorData.error || "Failed to update member."}`);
        setIsError(true);
      }
    } catch (error) {
      console.error("Network or other error during update:", error);
      setMessage("Network error or server unreachable during update.");
      setIsError(true);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border-2 border-blue-400">
      <h2 className="text-2xl font-bold text-blue-800 text-center">
        Edit Family Member
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

      <form onSubmit={handleSubmit}>
        {/* Floating Label for First Name */}
        <div className="mb-4 relative bg-inherit">
          <input
            type="text"
            id="edit_first_name" // Unique ID for edit form
            name="first_name"
            value={formData.first_name}
            placeholder=" "
            onChange={handleChange}
            className="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-blue-600"
            required
          />
          <label
            htmlFor="edit_first_name"
            className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm transition-all"
          >
            First Name
          </label>
        </div>

        {/* Floating Label for Middle Name */}
        <div className="mb-4 relative bg-inherit">
          <input
            type="text"
            id="edit_middle_name" // Unique ID
            name="middle_name"
            value={formData.middle_name || ""}
            placeholder=" "
            onChange={handleChange}
            className="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-blue-600"
          />
          <label
            htmlFor="edit_middle_name"
            className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm transition-all"
          >
            Middle Name
          </label>
        </div>

        {/* Floating Label for Last Name */}
        <div className="mb-4 relative bg-inherit">
          <input
            type="text"
            id="edit_last_name" // Unique ID
            name="last_name"
            value={formData.last_name}
            placeholder=" "
            onChange={handleChange}
            className="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-blue-600"
            required
          />
          <label
            htmlFor="edit_last_name"
            className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm transition-all"
          >
            Last Name
          </label>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label
            htmlFor="edit_dob"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Date of Birth:
          </label>
          <input
            type="date"
            id="edit_dob" // Unique ID
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* is_alive checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_alive"
              checked={formData.is_alive}
              onChange={handleIsAliveChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Still Alive
            </span>
          </label>
        </div>

        {/* Date of Death input (conditionally rendered) */}
        {!formData.is_alive && (
          <div className="mb-4">
            <label
              htmlFor="edit_dod"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date of Death:
            </label>
            <input
              type="date"
              id="edit_dod" // Unique ID
              name="dod"
              value={formData.dod || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required={!formData.is_alive}
            />
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button" // Important: type="button" to prevent form submission
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Member
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMemberForm;

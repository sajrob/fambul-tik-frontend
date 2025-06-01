// src/components/AddMemberForm.jsx

import React, { useState } from "react"; // Ensure useState is imported

function AddMemberForm() {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    dod: null, // Initially null as we assume alive by default
    is_alive: true, // Default to true
  });
  // State for messages
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle is_alive checkbox change specifically to reset dod if becomes alive
  const handleIsAliveChange = (e) => {
    const isChecked = e.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      is_alive: isChecked,
      dod: isChecked ? null : prevFormData.dod, // Reset dod to null if becomes alive
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Clear previous messages
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), //converts your form data into a JSON string that the backend expects
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Member added successfully:", result);
        setMessage("Member added successfully!");
        setIsError(false);
        // Reset form to initial state after successful submission
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          dob: "",
          dod: null,
          is_alive: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to add member:", errorData);
        setMessage(`Error: ${errorData.error || "Failed to add member."}`);
        setIsError(true);
      }
    } catch (error) {
      console.error("Network or other error:", error);
      setMessage("Network error or server unreachable.");
      setIsError(true);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border-2 border-blue-400">
      <h2 className="text-2xl font-bold text-gray-900 text-center">
        Add New Family Member
      </h2>

      {/* Message display area */}
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
            id="first_name"
            name="first_name"
            value={formData.first_name}
            placeholder=" " // Important: Placeholder must not be empty for peer-placeholder-shown to work
            onChange={handleChange}
            className="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-blue-600"
            required
          />
          <label
            htmlFor="first_name"
            className="absolute cursor-text left-0 -top-3 text-sm text-blue-500 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm transition-all"
          >
            First Name
          </label>
        </div>

        {/* Floating Label for Middle Name */}
        <div className="mb-4 relative bg-inherit">
          <input
            type="text"
            id="middle_name"
            name="middle_name"
            value={formData.middle_name || ""}
            placeholder=" " // Important: Placeholder must not be empty for peer-placeholder-shown to work
            onChange={handleChange}
            className="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-blue-500 focus:outline-none focus:border-blue-600"
          />
          <label
            htmlFor="middle_name"
            className="absolute cursor-text left-0 -top-3 text-sm text-blue-600 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm transition-all"
          >
            Middle Name
          </label>
        </div>

        {/* Floating Label for Last Name */}
        <div className="mb-4 relative bg-inherit">
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            placeholder=" " // Important: Placeholder must not be empty for peer-placeholder-shown to work
            onChange={handleChange}
            className="peer bg-transparent h-10 w-full rounded-lg text-gray-600 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-blue-600"
            required
          />
          <label
            htmlFor="last_name"
            className="absolute cursor-text left-0 -top-3 text-sm text-blue-600 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm transition-all"
          >
            Last Name
          </label>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label
            htmlFor="dob"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Date of Birth:
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required // Make DOB required
          />
        </div>

        {/* is_alive checkbox (toggle for Date of Death) */}
        <div className="mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_alive"
              checked={formData.is_alive} // Controlled component
              onChange={handleIsAliveChange}
              className="sr-only peer"
            />
            {/* Tailwind toggle switch styling */}
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Still Alive
            </span>
          </label>
        </div>

        {/* Date of Death input (conditionally rendered) */}
        {!formData.is_alive && ( // Render only if is_alive is false
          <div className="mb-4">
            <label
              htmlFor="dod"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date of Death:
            </label>
            <input
              type="date"
              id="dod"
              name="dod"
              value={formData.dod || ""} // Use empty string for null dod to prevent React warning
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required={!formData.is_alive} // Make required only if not alive
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Member
        </button>
      </form>
    </div>
  );
}

export default AddMemberForm;

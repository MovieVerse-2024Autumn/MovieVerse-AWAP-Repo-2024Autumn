import React, { useState } from "react";
import "../styles/Groups.css";

export default function Group() {
  const [yourGroups, setYourGroups] = useState([
    {
      name: "Group Name1",
      description:
        "Sentiments two occasional affronting solicitude travelling and one contrasted. Fortune day out",
    },
    {
      name: "Group Name2",
      description:
        "Sentiments two occasional affronting solicitude travelling and one contrasted. Fortune day out",
    },
  ]);

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  // Handle showing the form to create a new group
  const handleCreateNewGroup = () => {
    setShowGroupForm(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newGroup.name && newGroup.description) {
      setYourGroups([...yourGroups, newGroup]); // Add the new group to the list
      setNewGroup({ name: "", description: "" }); // Reset the form
      setShowGroupForm(false); // Hide the form
    }
  };

  return (
    <div className="group-container">
      <div className="section">
        <h2>Your groups</h2>
        <div className="group-list">
          {yourGroups.map((group, index) => (
            <div className="group-card" key={index}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
            </div>
          ))}
          <button className="create-group-btn" onClick={handleCreateNewGroup}>
            + Create a new group
          </button>
        </div>
      </div>

      {showGroupForm && (
        <div className="group-form-container">
          <h3>Create a New Group</h3>
          <form onSubmit={handleFormSubmit} className="group-form">
            <input
              type="text"
              name="name"
              placeholder="Group Name"
              value={newGroup.name}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Group Description"
              value={newGroup.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <button type="submit" className="submit-btn">
              Create Group
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowGroupForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

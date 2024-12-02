import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import GroupCard from "../components/GroupCard";
import "../styles/Groups.css";

const url = "http://localhost:3001/api/groups";

export default function Group() {
  const [yourGroups, setYourGroups] = useState([]);

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch user-created groups
  const fetchYourGroups = async () => {
    try {
      const response = await fetch(`${url}/my-groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setYourGroups(data);
    } catch (error) {
      console.error("Error fetching your groups:", error);
    }
  };

  const fetchAailableGroups = async () => {
    try {
      const response = await fetch(`${url}/available-groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setAvailableGroups(data);
    } catch (error) {
      console.error("Error fetching available groups:", error);
    }
  };

  useEffect(() => {
    fetchYourGroups();
    fetchAailableGroups();
  }, []);

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
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${url}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const createdGroup = await response.json();
      setYourGroups([...yourGroups, createdGroup]);
      setNewGroup({ name: "", description: "" });
      setShowGroupForm(false);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  return (
    <div className="group-container">
      <div className="section">
        <h2>Your groups</h2>
        <div className="group-list">
          {yourGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => navigate(`/group/${group.id}`)}
            />
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

      <div className="section">
        <h2>Groups you joined</h2>
        <div className="group-list">
          {joinedGroups.map((group, index) => (
            <div className="group-card" key={index}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
            </div>
          ))}
        </div>
        <p>More...</p>
      </div>
      <div className="section">
        <h2>More groups</h2>
        <div className="group-list">
          {availableGroups.map((group, index) => (
            <div className="group-card" key={index}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <button className="join-group-btn">Join</button>
            </div>
          ))}
          {availableGroups.length === 0 && <p>No more groups to join.</p>}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import GroupCard from "../components/GroupCard";
import Notification from "./Notification";
import "../styles/Groups.css";

const url = "http://localhost:3001/api/groups";

export default function Group() {
  const [yourGroups, setYourGroups] = useState([]);

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

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

  // Fetch available groups for joining
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

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${url}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchYourGroups();
    fetchAailableGroups();
    fetchUnreadCount();
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

  // Handle form submission for creating a new group
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

  // Handle sending a join request
  const handleJoinGroup = async (groupId) => {
    try {
      const response = await fetch(`${url}/join-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ groupId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send join request");
      }

      const updatedGroupList = availableGroups.filter(
        (group) => group.id !== groupId
      );
      setAvailableGroups(updatedGroupList);

      alert("Your join request has been sent!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request. Please try again.");
    }
  };

  return (
    <div className="group-container">
      {/* Notification Bell Icon */}
      <div
        className="notification-bell"
        onClick={() => setIsNotificationsVisible(!isNotificationsVisible)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </div>

      {/* Show Notification Component when bell is clicked */}
      {isNotificationsVisible && (
        <Notification setUnreadCount={setUnreadCount} />
      )}

      {/* Your Groups */}
      <div className="section">
        <h2>Your groups</h2>
        <div className="group-list">
          {yourGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => console.log(`Clicked on ${group.name}`)}
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

      {/* More groups */}
      <div className="section">
        <h2>More groups</h2>
        <div className="group-list">
          {availableGroups.map((group, index) => (
            <div className="group-card" key={index}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <button
                className="join-group-btn"
                onClick={() => handleJoinGroup(group.id)}
              >
                Join
              </button>
            </div>
          ))}
          {availableGroups.length === 0 && <p>No more groups to join.</p>}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';

=======
import { jwtDecode } from "jwt-decode";
>>>>>>> 4652cbf5fe5f3b0994559400f282da434288f385
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

  const getAccountId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id; // Assuming `id` is part of the decoded JWT payload
    }
    return null;
  };
  const accountId = getAccountId();

  useEffect(() => {
    fetchYourGroups();
    fetchAailableGroups();
    fetchUnreadCount();
    fetchJoinedGroups();
  }, []);

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

  // Fetch available groups for joining
  const fetchAailableGroups = async () => {
    try {
      const response = await fetch(`${url}/available-groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      // update groups status
      const updatedGroups = data.map((group) => ({
        ...group,
        status: group.status || "join", // Default status to "join"
      }));

      setAvailableGroups(updatedGroups);
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

  // Fetch groups the user has joined
  const fetchJoinedGroups = async () => {
    try {
      const response = await fetch(`${url}/joined-groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setJoinedGroups(data);
    } catch (error) {
      console.error("Error fetching joined groups:", error);
    }
  };

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

      setAvailableGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId ? { ...group, status: "in process" } : group
        )
      );

      alert("Your join request has been sent!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request. Please try again.");
    }
  };

  // Handle admin decision on join request
  const handleAction = async (notificationId, groupId, senderId, action) => {
    try {
      const response = await fetch(`${url}/notifications/handle-request`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          notificationId,
          groupId,
          userId: senderId,
          action,
        }),
      });

      const data = await response.json();
      console.log("Response from server:", data, "in Groups.js/handleAction");

      if (!response.ok) {
        throw new Error("Failed to handle request");
      }

      if (action === "accept") {
        const groupToMove = availableGroups.find(
          (group) => group.id === groupId
        );
        if (!groupToMove) {
          console.error(
            `Group with ID ${groupId} not found in availableGroups`
          );
          return; // if group not found, do not proceed
        }
        setJoinedGroups((prevGroups) => [...prevGroups, groupToMove]);
        setAvailableGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );
      } else if (action === "decline") {
        setAvailableGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId ? { ...group, status: "join" } : group
          )
        );
      }

      // alert(`Successfully handle the request!`);
    } catch (error) {
      console.error("Error handling admin decision:", error);
      alert("Failed to process the request. Please try again.");
    }
  };

  if (!accountId) {
    return <p>Please Sign In to view your groups.</p>;
  }

  return (
    <div className="group-container">
      {/* Notification Bell Icon */}
      <div onClick={() => setIsNotificationsVisible(!isNotificationsVisible)}>
        <span>🔔</span>
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </div>

      {/* Show Notification Component when bell is clicked */}
      {isNotificationsVisible && (
        <Notification
          setUnreadCount={setUnreadCount}
          handleAction={handleAction}
        />
      )}

      {/* Your Groups */}
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

      {/* Groups you joined */}
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
              {group.status === "in process" ? (
                <button disabled>In Process</button>
              ) : (
                <button onClick={() => handleJoinGroup(group.id)}>Join</button>
              )}
            </div>
          ))}
          {availableGroups.length === 0 && <p>No more groups to join.</p>}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

const url = "http://localhost:3001/api/groups";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${url}/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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
      if (!response.ok) {
        throw new Error("Failed to handle request");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notificationId)
      );

      alert(
        `Successfully ${
          action === "accept" ? "accepted" : "declined"
        } the request!`
      );
    } catch (error) {
      console.error("Error handling request:", error);
      alert("Failed to process the request. Please try again.");
    }
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          <p>{notification.message}</p>
          {notification.type === "join_request" && (
            <div>
              <button
                onClick={() =>
                  handleAction(
                    notification.id,
                    notification.group_id,
                    notification.sender_id,
                    "accept"
                  )
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleAction(
                    notification.id,
                    notification.group_id,
                    notification.sender_id,
                    "decline"
                  )
                }
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from "react";

const url = "http://localhost:3001/api/groups";

export default function Notification({ setUnreadCount }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const [requestResponse, responseResponse] = await Promise.all([
        fetch(`${url}/notifications/request`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch(`${url}/notifications/response`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const requestNotification = await requestResponse.json();
      const responseNotification = await responseResponse.json();
      setNotifications([...requestNotification, ...responseNotification]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${url}/notifications/mark-as-read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notificationId)
      );

      // After marking as read, update unread count
      const unreadResponse = await fetch(`${url}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const unreadData = await unreadResponse.json();
      setUnreadCount(unreadData.count);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

      // After handling the action, update unread count， update unread notification count
      const unreadResponse = await fetch(`${url}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const unreadData = await unreadResponse.json();
      setUnreadCount(unreadData.count);

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
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="notification">
            <p>{notification.message}</p>
            {/* Request to join the group */}
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

            {/* Join Request Response for Applicants */}
            {notification.type === "join_request_response" && (
              <div>
                <button onClick={() => markAsRead(notification.id)}>
                  Mark as Read
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

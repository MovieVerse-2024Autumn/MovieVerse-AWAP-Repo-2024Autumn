import React from "react";
import "../styles/GroupCard.css";

const GroupCard = ({
  group,
  onClick,
  showDeleteButton = false,
  onDelete,
  actionButton = null,
}) => {
  return (
    <div className="group-card-container" onClick={onClick}>
      <div className="group-card">
        <h3>{group.name}</h3>
        <p>{group.description}</p>
        {showDeleteButton && (
          <button
            className="delete-group-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onClick for the card
              onDelete(group.id);
            }}
          >
            Delete
          </button>
        )}
        {actionButton && <div className="action-button">{actionButton}</div>}
      </div>
    </div>
  );
};

export default GroupCard;

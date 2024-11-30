import React from "react";
import "../styles/GroupCard.css";

const GroupCard = ({ group, onClick }) => {
  return (
    <div className="group-card" onClick={onClick}>
      <h3>{group.name}</h3>
      <p>{group.description}</p>
    </div>
  );
};

export default GroupCard;

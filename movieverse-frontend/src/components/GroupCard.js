import React from "react";
import { Link } from "react-router-dom";
import "../styles/GroupCard.css";

const GroupCard = ({ group, onClick }) => {
  return (
    <div className="group-card" onClick={onClick}>
      <Link to={`/groups/${group.id}`} className="group-card-link">
        <h3>{group.name}</h3>
        <p>{group.description}</p>
      </Link>
    </div>
  );
};

export default GroupCard;

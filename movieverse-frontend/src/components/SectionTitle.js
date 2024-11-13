import React from "react";
import { Link } from "react-router-dom";

export default function SectionTitle({ title, linkPath }) {
  return (
    <div>
      <h3>{title}</h3>
      <Link to={linkPath}>
        <span>MORE</span>
      </Link>
    </div>
  );
}

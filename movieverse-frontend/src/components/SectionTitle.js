import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function SectionTitle({ title, linkPath }) {
  return (
    <div className={styles.sectionTitle}>
      <h3>{title}</h3>
      <Link to={linkPath}>
        <span>MORE</span>
      </Link>
    </div>
  );
}

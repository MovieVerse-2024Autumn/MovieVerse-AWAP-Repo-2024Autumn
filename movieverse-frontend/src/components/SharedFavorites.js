import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/SharedFavorites.module.css";

const SharedFavorites = () => {
  const { account_id } = useParams(); // Fetch account ID from URL
  const [favorites, setFavorites] = useState([]); // State to hold shared favorites

  useEffect(() => {
    const fetchSharedFavorites = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API}api/favorites/shared/${account_id}`
        );
        const data = await response.json();
        setFavorites(data); // Update state with shared favorites
      } catch (error) {
        console.error("Error fetching shared favorites:", error);
      }
    };

    fetchSharedFavorites();
  }, [account_id]);

  return (
    <div className={styles["shared-favorites"]}>
      <h1 className={styles.title}>My Favorites</h1>
      <div className={styles["shared-favorites-grid"]}>
        {favorites.length ? (
          favorites.map((fav) => (
            <div key={fav.movie_id} className={styles["shared-favorite-item"]}>
              <img
                src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}
                alt={fav.title}
              />
              <h3>{fav.title}</h3>
            </div>
          ))
        ) : (
          <p className={styles["empty-message"]}>No shared favorites found.</p>
        )}
      </div>
    </div>
  );
};

export default SharedFavorites;

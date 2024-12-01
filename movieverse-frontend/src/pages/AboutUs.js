import React from "react";
import styles from "../styles/AboutUs.module.css"; 
function AboutUs() {
  return (
    <div className={styles["about-us"]}>
      <h1 className={styles["title"]}>About Us</h1>
      <p className={styles["intro"]}>
        Welcome to <strong>MovieVerse</strong>, your one-stop destination for exploring your favorite movies. Our platform was created by a group of university students as part of a group project to showcase our skills in Advance web development.
      </p>

      <section className={styles["section"]}>
        <h2 className={styles["section-title"]}>Our Mission</h2>
        <p className={styles["text"]}>
          At <strong>MovieVerse</strong>, our mission is to provide an exceptional experience for movie enthusiasts to discover, save, and share their favorite films. Beyond just creating a favorite list, users can add reviews, create groups, and  members can share movie details. Additionally, users can explore movie showtimes for convenient viewing options. We aim to build an engaging platform where movie lovers can connect, explore cinematic masterpieces, and foster a community of shared interests.
        </p>
      </section>

      <section className={styles["section"]}>
        <h2 className={styles["section-title"]}>Our Team</h2>
        <div className={styles["team-container"]}>
          <div className={styles["team-member"]}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Anna Kasprzak"
              className={styles["team-photo"]}
            />
            <h3 className={styles["member-name"]}>Anna</h3>
          </div>
          <div className={styles["team-member"]}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Congying Zhao"
              className={styles["team-photo"]}
            />
            <h3 className={styles["member-name"]}>Congying</h3>
          </div>
          <div className={styles["team-member"]}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Manjula Karunanayaka"
              className={styles["team-photo"]}
            />
            <h3 className={styles["member-name"]}>Manjula</h3>
          </div>
          <div className={styles["team-member"]}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Sandip Bade"
              className={styles["team-photo"]}
            />
            <h3 className={styles["member-name"]}>Sandip</h3>
          </div>
          <div className={styles["team-member"]}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Shankar Jaiswal"
              className={styles["team-photo"]}
            />
            <h3 className={styles["member-name"]}>Shankar</h3>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;

import React from "react";
import styles from "../styles/PrivacyPolicy.module.css"; 

function PrivacyPolicy() {
  return (
    <div className={styles["privacy-policy"]}>
      <h1 className={styles["privacy-title"]}>Privacy Policy</h1>
      <p className={styles["effective-date"]}>Effective Date: 13/12/2024</p>

      <section className={styles["privacy-section"]}>
        <h2 className={styles["section-title"]}>Introduction</h2>
        <p>
          Welcome to <strong>MovieVerse</strong>. Protecting your privacy is important to us. This
          Privacy Policy explains how we collect, use, and safeguard your data when you use our website
          and services.
        </p>
      </section>

      <section className={styles["privacy-section"]}>
        <h2 className={styles["section-title"]}>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <div className={styles["list-container"]}>
          <div className={styles["list-item"]}>Account details (e.g., Name, email address).</div>
          <div className={styles["list-item"]}>Favorites and reviews you add to your profile.</div>
          <div className={styles["list-item"]}>Browser type, device type, and operating system.</div>
          <div className={styles["list-item"]}>IP address, cookies, and website usage data.</div>
        </div>
      </section>

      <section className={styles["privacy-section"]}>
        <h2 className={styles["section-title"]}>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <div className={styles["list-container"]}>
          <div className={styles["list-item"]}>Display movie details and manage your favorites and reviews.</div>
          <div className={styles["list-item"]}>Improve our website functionality and user experience.</div>
          <div className={styles["list-item"]}>Provide personalized recommendations.</div>
          <div className={styles["list-item"]}>Respond to user inquiries and provide customer support.</div>
        </div>
      </section>

      <section className={styles["privacy-section"]}>
        <h2 className={styles["section-title"]}>3. Data Sharing</h2>
        <p>We do not sell your data. However, we may share it in the following cases:</p>
        <div className={styles["list-container"]}>
          <div className={styles["list-item"]}>
            With trusted third-party services like the TMDB API to fetch movie details. Refer to their{" "}
            <a
              href="https://www.themoviedb.org/documentation/api/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["link"]}
            >
              privacy policy
            </a>
            .
          </div>
          <div className={styles["list-item"]}>To comply with legal obligations or requests from authorities.</div>
          <div className={styles["list-item"]}>
            When you enable sharing, your favorite movies may be accessible via a public link.
          </div>
        </div>
      </section>

      <section className={styles["privacy-section"]}>
        <h2 className={styles["section-title"]}>4. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <div className={styles["list-container"]}>
          <div className={styles["list-item"]}>Email: info@movieverse.com</div>
          <div className={styles["list-item"]}>Phone: +358 411234567</div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;

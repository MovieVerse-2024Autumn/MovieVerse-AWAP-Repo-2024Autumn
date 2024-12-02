import React, { useState, useEffect } from "react";
import "../styles/delete-account.css";

const DeleteAccountFlow = () => {
  const [step, setStep] = useState(0); // 0: Options view, 1: Reason selection, 2: Password confirmation
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the JWT token payload
        if (decoded.id) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // Invalid token
        }
      } catch (error) {
        setIsAuthenticated(false); // Malformed token
      }
    } else {
      setIsAuthenticated(false); // No token
    }
  }, []);

  // Retrieve user ID from JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the JWT token payload
    return decoded.id; // Assuming the token contains user ID as 'id'
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleNext = () => {
    if (!reason) {
      alert("Please select a reason for account deletion.");
      return;
    }
    setStep(2); // Move to password confirmation step
  };

  const handleDelete = async () => {
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/auth/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
        body: JSON.stringify({ reason, password }), // Send reason and password in the body
      });

      if (response.ok) {
        alert("Account deleted successfully!");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page after deletion
      } else {
        const data = await response.json();
        alert(`Error: ${data.message || "Unable to delete account"}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleOptionSelect = (option) => {
    if (option === "profile") {
      alert("This would show the user's profile.");
    } else if (option === "deleteAccount") {
      if (!isAuthenticated) {
        alert("You must be signed in to delete your account.");
        return;
      }
      setStep(1); // Move to reason selection step for account deletion
    }
  };

  if (!isAuthenticated) {
    return <p>Please sign in to access account deletion.</p>; // Redirect or block access if not signed in
  }

  return (
    <div className="delete-account-container">
      <h2>Account Settings</h2>

      {/* Step 0: Account Options (Profile or Delete Account) */}
      {step === 0 && (
        <div>
          <h3>Select an option</h3>
          <div className="delete-account-options">
            <button onClick={() => handleOptionSelect("profile")}>
              Profile
            </button>
            <button onClick={() => handleOptionSelect("deleteAccount")}>
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Reason Selection for Account Deletion */}
      {step === 1 && (
        <div>
          <h3>Why are you leaving?</h3>
          <select
            value={reason}
            onChange={handleReasonChange}
            className="select"
          >
            <option value="">Select a reason</option>
            <option value="I don't find it useful">
              I don't find it useful
            </option>
            <option value="Privacy concerns">Privacy concerns</option>
            <option value="Switching to a different service">
              Switching to a different service
            </option>
            <option value="Other">Other</option>
          </select>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Step 2: Password Confirmation for Deletion */}
      {step === 2 && (
        <div>
          <h3>Confirm Password</h3>
          <p>To delete your account, please enter your password.</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button onClick={handleDelete}>Delete Account</button>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountFlow;

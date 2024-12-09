import React, { useState } from "react";
import "../styles/DeleteAccount.css";

const DeleteAccountFlow = ({ onAccountDelete }) => {
  const [step, setStep] = useState(0); // 0: Options view, 1: Reason selection, 2: Password confirmation
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");

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
    console.log("Reason:", reason);
    console.log("Password:", password);

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API}api/auth/delete`, {
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

  return (
    <div className="delete-account-container">
      <h2>Are You Going to Delete Your Account?</h2>

      {/* Step 0: Account Options (Profile or Delete Account) */}
      {step === 0 && (
        <div className="delete-account-options">
          <button onClick={() => setStep(1)}>
            Yes, I want to delete my account.
          </button>
          <button onClick={onAccountDelete}>No, let me think about it.</button>
        </div>
      )}

      {/* Step 1: Reason Selection for Account Deletion */}
      {step === 1 && (
        <div>
          <h3>Why are you leaving?</h3>
          <select
            value={reason}
            onChange={handleReasonChange}
            className="delete-reason-select"
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

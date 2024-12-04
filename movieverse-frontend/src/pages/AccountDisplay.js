import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider";
import "../styles/AccountDisplay.css";

const AccountDisplay = () => {
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate(`/${user.profileUrl}/profile`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="account-display">
      <div className="account-icon" onClick={toggleDropdown}>
        <span className="account-letter">
          {`${user.firstName?.charAt(0).toUpperCase()}${user.lastName
            ?.charAt(0)
            .toUpperCase()}`}
        </span>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleProfileClick}>
            My Profile
          </button>
          <button className="dropdown-item" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
export default AccountDisplay;

import React, { useState, useEffect } from "react";
import '../styles/GroupDetails.css';
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



const url = "http://localhost:3001/api/groups";

export default function GroupDetails() {
  const { id } = useParams();


  const [groupDetails, setGroupDetails] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);

  const [currentUser , setCurrentUser ] = useState('Ram'); // Example user
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin privileges

  const getAccountId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id; // Assuming `id` is part of the decoded JWT payload
    }
    return null;
  };
  const accountId = getAccountId();

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`${url}/getdetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          groupId: id,
      }),
      });
      const data = await response.json();
      if(data!==null){
        setGroupDetails(data.groupDetails);
        setGroupMembers(data.groupMembers);
        setIsAdmin (data.groupDetails.admin_id == accountId);
      }
      
    } catch (error) {
      console.error("Error fetching group info:", error);
    }
  };

  

  const handleLeaveGroup = () => {
    alert('You have successfully left the group.');
    // Logic for leaving the group (update group state)
  };

  const handleRemoveUser  = (user) => {
    if (isAdmin) {
      const updatedUsers = groupDetails.users.filter((u) => u !== user);
      setGroupDetails({});
      alert(`${user} has been removed from the group.`);
    } else {
      alert('Only the admin can remove members.');
    }
  };

  if (Object.keys(groupDetails).length === 0) {
    return <p>Unauthorized.</p>;
  }
  return (
    <div className="group-details-container">
      {/* Group Header */}
      <div className="group-header">
        <h1>{groupDetails.name}</h1>
        <p>{groupDetails.description}</p>
      </div>

      {/* Group Content */}
      <div className="group-content">
        {/* Posts Section */}
        <div className="posts-section">
          <h3>Latest Posts</h3>
          {/* {groupDetails.posts.map((post) => (
            <div className="post-card" key={post.postId}>
              <div className="post-text">
                <p>{post.postData}</p>
              </div>
              <div className="post-image">
                <img
                  src={post.moviePoster}
                  alt="Movie Poster"
                  className="movie-image"
                />
              </div>
            </div>
          ))} */}
        </div>




        {/* Members Section */}
        <div className="members-section">
          <h3>Group Members</h3>
          <ol className="members-list">
            {groupMembers.map((user) => (
              <li key={user.name} className="member-item">
                <span>{user.name} {groupDetails.admin_id == user.userid && '(Admin)'} </span>
                {isAdmin && user.userid !== accountId  && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveUser (user)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ol>
          <button
            className="leave-group-btn"
            onClick={handleLeaveGroup}
            style={{ marginTop: '20px' }}
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
}




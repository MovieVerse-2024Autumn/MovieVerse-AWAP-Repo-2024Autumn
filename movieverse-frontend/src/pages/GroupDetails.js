import React, { useState, useEffect } from "react";
import "../styles/GroupDetails.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PostCreate from "../components/CreatePost";
import { useUser } from "../utils/UserProvider";

const url = "http://localhost:3001/api/groups";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate function

  const [groupDetails, setGroupDetails] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);

  //const [currentUser, setCurrentUser] = useState('Ram'); // Example user
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin privileges

  const [posts, setPosts] = useState([]);
  const { user } = useUser();

  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

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
    fetchGroupPosts();
  }, [fetchGroupDetails, fetchGroupPosts]);

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
      if (data !== null) {
        setGroupDetails(data.groupDetails);
        setGroupMembers(data.groupMembers);
        setIsAdmin(data.groupDetails?.admin_id === accountId);
      }
    } catch (error) {
      console.error("Error fetching group info:", error);
    }
  };

  const fetchGroupPosts = async () => {
    try {
      const response = await fetch(`${url}/getgrouppost/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching group posts:", error);
    }
  };

  const handleLeaveGroup = async (userid) => {
    const confirmation = window.confirm(
      "Are you sure you want to leave from the group?"
    );
    if (confirmation) {
      if (!userid) {
        console.error("User ID is undefined or null!");
        return;
      }
      try {
        const response = await fetch(`${url}/removegroupmember`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            accountId: userid, // Ensure accountId is correct
            groupId: parseInt(id), // Ensure group is passed here
          }),
        });

        if (response.ok) {
          setGroupMembers((prevFavorites) =>
            prevFavorites.filter((user) => user.userid !== userid)
          );
          navigate("/groups");
        } else {
          const errorData = await response.json();
          console.error(
            "Failed to leave the group:",
            errorData.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error leaving the group:", error);
      }
    }
  };

  const handleRemoveUser = async (userid, name) => {
    const confirmationRemove = window.confirm(
      "Are you sure you want to remove " + name + " from the group?"
    );
    if (confirmationRemove) {
      if (isAdmin) {
        if (!userid) {
          console.error("User ID is undefined or null!");
          return;
        }
        try {
          const response = await fetch(`${url}/removegroupmember`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              accountId: userid, // Ensure accountId is correct
              groupId: parseInt(id), // Ensure group is passed here
            }),
          });

          if (response.ok) {
            setGroupMembers((prevFavorites) =>
              prevFavorites.filter((user) => user.userid !== userid)
            );
            alert("Removed a user from the group.");
          } else {
            const errorData = await response.json();
            console.error(
              "Failed to remove user:",
              errorData.error || "Unknown error"
            );
          }
        } catch (error) {
          console.error("Error removing user:", error);
        }
      } else {
        alert("Only the admin can remove members.");
      }
    }
  };
  if (!accountId) {
    return <p>Please Sign In to view your groups.</p>;
  }
  if (Object.keys(groupDetails)?.length === 0 || !groupDetails) {
    return <p>Unauthorized.</p>;
  }
  return (
    <div className="group-details-container">
      {/* Group Header */}
      <div className="group-header">
        <h1>{groupDetails.name}</h1>
        <p>{groupDetails.description}</p>
      </div>

      <div className="display-flex">
        {/* Post Creation Section */}
        <PostCreate onAddPost={addPost} groupId={id} />
        {/* Members Section */}
        <div className="members-section mx-1">
          <h3>Group Members</h3>
          <ol className="members-list">
            {groupMembers.map((gm) => (
              <li key={gm.userid} className="member-item">
                <span>
                  {gm.name} {groupDetails.admin_id === gm.userid && "(Admin)"}{" "}
                </span>
                {isAdmin && gm.userid !== accountId && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveUser(gm.userid, gm.name)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ol>
          {!isAdmin && (
            <button
              className="leave-group-btn"
              onClick={() => handleLeaveGroup(accountId)}
              style={{ marginTop: "20px" }}
            >
              Leave Group
            </button>
          )}
        </div>
      </div>

      {/* Group Content */}
      <div className="group-content">
        {/* Posts Section */}
        <div className="posts-section m-1">
          <h3>Latest Posts</h3>
          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-author">
                <h4 className="upperCase">
                  {user.firstName} {user.lastName}
                </h4>
              </div>

              <div className="post-text">
                <p>{post.content}</p>
              </div>
              <Link to={`/movies/${post.movieid}`}>
                <div className="post-text">
                  <b>{post.movietitle}</b>
                </div>
                <div className="post-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${post.movieposter}`}
                    alt={post.movietitle}
                    className="movie-image"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import '../styles/GroupDetails.css';

export default function GroupDetails() {
  const [groupDetails, setGroupDetails] = useState({
    name: 'Group name 1',
    description:
      'A fun group where movie lovers come together to share their favorite films, reviews, and more.',
    users: ['Sandip', 'Shyam', 'Baburoa','salah'],
    posts: [
      {
        postId: 1,
        postData: 'Inception was a masterpiece! The plot twist blew my mind.',
        movieId: 2,
        moviePoster:
          'https://image.tmdb.org/t/p/w500/spWV1eRzlDxvai8LbxwAWR0Vst4.jpg',
      },
      {
        postId: 2,
        postData: 'The Dark Knight is still one of the best superhero films ever.',
        movieId: 4,
        moviePoster:
          'https://image.tmdb.org/t/p/w500/spWV1eRzlDxvai8LbxwAWR0Vst4.jpg',
      },
    ],
  });

  const [currentUser , setCurrentUser ] = useState('Ram'); // Example user
  const [isAdmin, setIsAdmin] = useState(true); // Toggle for admin privileges

  const handleLeaveGroup = () => {
    alert('You have successfully left the group.');
    // Logic for leaving the group (update group state)
  };

  const handleRemoveUser  = (user) => {
    if (isAdmin) {
      const updatedUsers = groupDetails.users.filter((u) => u !== user);
      setGroupDetails({ ...groupDetails, users: updatedUsers });
      alert(`${user} has been removed from the group.`);
    } else {
      alert('Only the admin can remove members.');
    }
  };

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
        {/* <div className="posts-section">
          <h3>Latest Posts</h3>
          {groupDetails.posts.map((post) => (
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
          ))}
        </div> */}

<div className="posts-section">
  <h3>Latest Posts</h3>
  {groupDetails.posts.map((post) => (
    <div className="post-card" key={post.postId}>
      {/* Header: Optional (Could include user info or date) */}
      <div className="post-header">
        <p>Post #{post.postId}</p>
        <p>Movie ID: {post.movieId}</p>
      </div>

      {/* Post Text */}
      <div className="post-text">
        <p>{post.postData}</p>
      </div>

      {/* Movie Poster */}
      <div className="post-image">
        <img
          src={post.moviePoster}
          alt="Movie Poster"
          className="movie-image"
        />
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button className="action-btn view-btn">View Movie</button>
        <button className="action-btn like-btn">Like</button>
      </div>
    </div>
  ))}
</div>


        {/* Members Section */}
        <div className="members-section">
          <h3>Group Members</h3>
          <ol className="members-list">
            {groupDetails.users.map((user) => (
              <li key={user} className="member-item">
                <span>{user}</span>
                {isAdmin && user !== currentUser  && (
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




DROP TABLE IF EXISTS GroupPosts CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS group_member CASCADE;
DROP TABLE IF EXISTS movie_group CASCADE;
DROP TABLE IF EXISTS favourite CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    link VARCHAR(255) NOT NULL,
    unique_profile_url VARCHAR(255)
);

CREATE TABLE review (
    id          SERIAL PRIMARY KEY,
    rating      INTEGER NOT NULL,
    title       VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    account_id  INTEGER,
    movie_id    INTEGER,
    movie_poster_path VARCHAR(255),
    like_count INT DEFAULT 0
);

CREATE TABLE favourite (
    account_id INTEGER NOT NULL,
    movie_id   INTEGER NOT NULL,
    PRIMARY KEY (account_id, movie_id),
    CONSTRAINT favourite_account_fk FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE movie_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    admin_id INTEGER NOT NULL,
    description VARCHAR(255) NOT NULL,
    CONSTRAINT movie_group_admin_fk FOREIGN KEY (admin_id) REFERENCES account(id)
);

CREATE TABLE group_member (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    member_status VARCHAR(50) NOT NULL,
    admin_id INTEGER NOT NULL,
    CONSTRAINT group_member_account_fk FOREIGN KEY (account_id) REFERENCES account(id),
    CONSTRAINT group_member_movie_group_fk FOREIGN KEY (group_id) REFERENCES movie_group(id),
    CONSTRAINT group_member_admin_fk FOREIGN KEY (admin_id) REFERENCES account(id),
    CONSTRAINT member_status_check CHECK (member_status IN ('accepted', 'declined', 'pending'))
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_read VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT NOW(),
    type VARCHAR(50) NOT NULL DEFAULT 'join_request',
    action_status VARCHAR(50) DEFAULT NULL,
    CONSTRAINT notification_sender_fk FOREIGN KEY (sender_id) REFERENCES account(id),
    CONSTRAINT notification_receiver_fk FOREIGN KEY (receiver_id) REFERENCES account(id),
    CONSTRAINT notification_group_fk FOREIGN KEY (group_id) REFERENCES movie_group(id)
);

CREATE TABLE GroupPosts (
    Id SERIAL PRIMARY KEY, 
    PostedBy INT NOT NULL,                
    GroupId INT NOT NULL,                
    Content TEXT NOT NULL,               
    MovieId INT,                         
    MovieTitle VARCHAR(255),             
    MoviePoster VARCHAR(255),                    
    PostedOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT post_createdby_fk FOREIGN KEY (PostedBy) REFERENCES account(id),
    CONSTRAINT group_id_fk FOREIGN KEY (GroupId) REFERENCES movie_group(id)
);


-- Insert test data
INSERT INTO account (email, password, first_name, last_name, is_active, link, unique_profile_url)
VALUES 
('test1@foo.com', 'hashedpassword1', 'John', 'Doe', TRUE, '/profile/1', 'unique-url-1'),
('test2@foo.com', 'hashedpassword2', 'Jane', 'Smith', TRUE, '/profile/2', 'unique-url-2');

INSERT INTO review (rating, title, description, review_date, account_id, movie_id, movie_poster_path, like_count)
VALUES 
(4, 'Great Movie', 'I really enjoyed the story and the acting.', '2023-12-01 14:30:00+00', 1, 101, '/images/movies/poster1.jpg', 25);

INSERT INTO review (rating, title, description, review_date, account_id, movie_id, movie_poster_path, like_count)
VALUES 
(3, 'Decent but flawed', 'The visuals were amazing, but the plot had some issues.', '2023-12-02 10:15:00+00', 2, 102, '/images/movies/poster2.jpg', 12);

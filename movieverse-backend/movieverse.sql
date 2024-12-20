DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS review;


CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
    link VARCHAR(255) NOT NULL
);
ALTER TABLE account
ALTER COLUMN password TYPE VARCHAR(255);
ALTER TABLE account
ADD COLUMN unique_profile_link VARCHAR(255);
ALTER TABLE account
RENAME COLUMN unique_profile_link TO unique_profile_url;



CREATE TABLE review (
    id          SERIAL PRIMARY KEY,
    rating      INTEGER NOT NULL,
    title       VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    account_id  INTEGER,
    movie_id    INTEGER,
    CONSTRAINT review_account_fk FOREIGN KEY (account_id) REFERENCES account(id)
);

ALTER TABLE review
ADD COLUMN movie_poster_path VARCHAR(255);
ALTER TABLE review ADD COLUMN like_count INT DEFAULT 0;



CREATE TABLE favourite (
    account_id INTEGER NOT NULL,
    movie_id   INTEGER NOT NULL,
    PRIMARY KEY (account_id, movie_id),
    CONSTRAINT favourite_account_fk FOREIGN KEY (account_id) REFERENCES account(id)
);


CREATE TABLE movie_group (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    owner_id    INTEGER NOT NULL,
    description VARCHAR(255) NOT NULL,
    CONSTRAINT movie_group_account_fk FOREIGN KEY (owner_id) REFERENCES account(id)
);

ALTER TABLE movie_group
RENAME COLUMN owner_id TO admin_id;


CREATE TABLE group_member (
    account_id    INTEGER NOT NULL,
    group_id      INTEGER NOT NULL,
    member_status VARCHAR(50) NOT NULL,
    PRIMARY KEY (account_id, group_id),
    CONSTRAINT group_member_account_fk FOREIGN KEY (account_id) REFERENCES account(id),
    CONSTRAINT group_member_movie_group_fk FOREIGN KEY (group_id) REFERENCES movie_group(id),
    CONSTRAINT member_status_check CHECK (member_status IN ('accepted', 'declined', 'pending'))
);
ALTER TABLE group_member
ADD COLUMN admin_id INTEGER NOT NULL;
ALTER TABLE group_member
ADD CONSTRAINT group_member_admin_fk FOREIGN KEY (admin_id) REFERENCES account(id);
ALTER TABLE group_member
DROP CONSTRAINT group_member_pkey;
ALTER TABLE group_member
DROP CONSTRAINT group_member_movie_group_fk;
ALTER TABLE group_member
ADD CONSTRAINT group_member_movie_group_fk
FOREIGN KEY (group_id) REFERENCES movie_group(id) ON DELETE CASCADE;




CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,       
    receiver_id INTEGER NOT NULL,    
    group_id INTEGER NOT NULL,       
    message TEXT NOT NULL,   
    status VARCHAR(50) DEFAULT 'unread', 
    created_at TIMESTAMP DEFAULT NOW(),
    type VARCHAR(50) NOT NULL DEFAULT 'join_request',  
    action_status VARCHAR(50) DEFAULT NULL;         
    CONSTRAINT notification_sender_fk FOREIGN KEY (sender_id) REFERENCES account(id),
    CONSTRAINT notification_receiver_fk FOREIGN KEY (receiver_id) REFERENCES account(id),
    CONSTRAINT notification_group_fk FOREIGN KEY (group_id) REFERENCES movie_group(id)
);  

ALTER TABLE notification
RENAME COLUMN status TO is_read;
ALTER TABLE notification
DROP CONSTRAINT notification_group_fk;
ALTER TABLE notification
ADD CONSTRAINT notification_group_fk
FOREIGN KEY (group_id) REFERENCES movie_group(id) ON DELETE CASCADE;


--To create group post table (04.12.24)
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

CREATE TABLE account (
    id             SERIAL PRIMARY KEY,
    username       VARCHAR(50) NOT NULL,
    email          VARCHAR(50) NOT NULL,
    password       VARCHAR(50) NOT NULL,
    favourite_id   INTEGER NOT NULL
);

CREATE TABLE favourite (
    account_id INTEGER NOT NULL,
    movie_id   INTEGER NOT NULL,
    PRIMARY KEY (account_id, movie_id)
);

CREATE TABLE group_page (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(50) NOT NULL,
    owner_id INTEGER NOT NULL
);

CREATE TABLE group_page_account (
    account_id    INTEGER NOT NULL,
    group_page_id INTEGER NOT NULL,
    PRIMARY KEY (account_id, group_page_id)
);

CREATE TABLE movie (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    description VARCHAR(50),
    genre       VARCHAR(50) NOT NULL,
    country     VARCHAR(50) NOT NULL
);

CREATE TABLE review (
    id          SERIAL PRIMARY KEY,
    rating      INTEGER NOT NULL,
    description VARCHAR(255),
    timestamp   TIMESTAMPTZ NOT NULL,
    movie_id    INTEGER,
    account_id  INTEGER
);

ALTER TABLE group_page_account
    ADD CONSTRAINT group_page_account_fk FOREIGN KEY (account_id)
        REFERENCES account (id);
 
ALTER TABLE group_page_account
    ADD CONSTRAINT account_group_page_fk FOREIGN KEY (group_page_id)
        REFERENCES group_page (id);

ALTER TABLE favourite
    ADD CONSTRAINT account_favourite_fk FOREIGN KEY (account_id)
        REFERENCES account (id);

ALTER TABLE favourite
    ADD CONSTRAINT favourite_movie_fk FOREIGN KEY (movie_id)
        REFERENCES movie (id);

ALTER TABLE review
    ADD CONSTRAINT review_account_fk FOREIGN KEY (account_id)
        REFERENCES account (id);

ALTER TABLE review
    ADD CONSTRAINT review_movie_fk FOREIGN KEY (movie_id)
        REFERENCES movie (id);

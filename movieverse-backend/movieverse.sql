CREATE TABLE account (
    id       SERIAL PRIMARY KEY,
    email    VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    status   CHAR(1) NOT NULL,
    link     VARCHAR(255) NOT NULL
);

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
    description VARCHAR(255) NOT NULL
);

CREATE TABLE group_member (
    account_id    INTEGER NOT NULL,
    group_id      INTEGER NOT NULL,
    member_status VARCHAR(50) NOT NULL,
    PRIMARY KEY (account_id, group_id),
    CONSTRAINT group_member_account_fk FOREIGN KEY (account_id) REFERENCES account(id),
    CONSTRAINT group_member_group_fk FOREIGN KEY (group_id) REFERENCES movie_group(id)
);

CREATE TABLE review (
    id          SERIAL PRIMARY KEY,
    rating      INTEGER NOT NULL,
    title       VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    account_id  INTEGER,
    movie_id    INTEGER,
    CONSTRAINT review_account_fk FOREIGN KEY (account_id) REFERENCES account(id)
);
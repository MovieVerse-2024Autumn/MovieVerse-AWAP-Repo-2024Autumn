console.log("Test Environment: ", process.env.NODE_ENV);

process.env.NODE_ENV = "test";

import dotenv from "dotenv";
dotenv.config({ path: "./.env.test" });

import { pool } from "./db.js";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;

const getToken = (userId, email) => {
  const secretKey = process.env.JWT_SECRET;
  //console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET, "in test.js");

  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  return sign({ id: userId, email: email }, secretKey);
};

const initializeTestDb = async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "initializeTestDb should only be run in the test environment. Current environment: " +
        process.env.NODE_ENV
    );
  }
  console.log("Cleaning up existing test data...");
  await pool.query("TRUNCATE TABLE account RESTART IDENTITY CASCADE");
  const accounts = [
    [
      "test1@foo.com",
      "hashedpassword1",
      "John",
      "Doe",
      true,
      "/profile/1",
      "unique-url-1",
    ],
    [
      "test2@foo.com",
      "hashedpassword2",
      "Jane",
      "Smith",
      true,
      "/profile/2",
      "unique-url-2",
    ],
  ];
  const accountQuery = `INSERT INTO account (email, password, first_name, last_name, is_active, link, unique_profile_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  for (let account of accounts) {
    await pool.query(accountQuery, account);
  }

  const reviews = [
    [
      4,
      "Great Movie",
      "I really enjoyed the story and the acting.",
      "2023-12-01 14:30:00+00",
      1,
      101,
      "/images/movies/poster1.jpg",
      25,
    ],
    [
      3,
      "Decent but flawed",
      "The visuals were amazing, but the plot had some issues.",
      "2023-12-02 10:15:00+00",
      2,
      102,
      "/images/movies/poster2.jpg",
      12,
    ],
  ];
  const reviewQuery = `INSERT INTO review (rating, title, description, review_date, account_id, movie_id, movie_poster_path, like_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  for (let review of reviews) {
    await pool.query(reviewQuery, review);
  }
  console.log("Test database initialized with test accounts and reviews.");
};

const insertTestUser = async (
  email,
  password,
  firstName,
  lastName,
  uniqueUrl
) => {
  const hashedPassword = await hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO account (email, password, first_name, last_name, is_active, link, unique_profile_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
    [email, hashedPassword, firstName, lastName, true, "", uniqueUrl]
  );
  return result.rows[0].id;
};

export { initializeTestDb, insertTestUser, getToken };

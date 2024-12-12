console.log("Test Environment: ", process.env.NODE_ENV);

process.env.NODE_ENV = "test";

import dotenv from "dotenv";
dotenv.config({ path: "./.env.test" });

import fs from "fs";
import path from "path";
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
  console.log("Test database initialized.");
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

process.env.NODE_ENV = "test";

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { pool } from "./db.js";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;

//console.log("Loaded ENV Variables:", process.env);

const __dirname = import.meta.dirname;

const getToken = (userId, email) => {
  const secretKey = process.env.JWT_SECRET;
  //console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET, "in test.js");

  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  return sign({ id: userId, email: email }, secretKey);
};

const initializeTestDb = async () => {
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../testMovieverse.sql"),
    "utf8"
  );
  await pool.query(sql);
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

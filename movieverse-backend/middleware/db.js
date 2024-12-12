import pkg from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env.development" });
}
//console.log("DB Password:", process.env.DB_PASSWORD);

const { Pool } = pkg;

const openDb = () => {
  let poolConfig;

  console.log("Current Environment:", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "test") {
    poolConfig = {
      user: process.env.TEST_DB_USER,
      host: process.env.TEST_DB_HOST,
      database: process.env.TEST_DB_NAME,
      password: process.env.TEST_DB_PASSWORD,
      port: process.env.TEST_DB_PORT,
      ssl: false,
    };
  } else if (process.env.NODE_ENV === "development") {
    poolConfig = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: false,
    };
  } else {
    poolConfig = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
  console.log("Database Config:", poolConfig);

  const pool = new Pool(poolConfig);
  return pool;
};

const pool = openDb();

export { pool };

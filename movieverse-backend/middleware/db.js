import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
//console.log("DB Password:", process.env.DB_PASSWORD);

const { Pool } = pkg;

const openDb = () => {
  let poolConfig;

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
  const pool = new Pool(poolConfig);
  return pool;
};

const pool = openDb();

export { pool };

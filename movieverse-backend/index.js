import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routers/authRouter.js";
import movieRouter from "./routers/movieRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";
import selectRouter from "./routers/selectRouter.js";
import groupsRouter from "./routers/groupsRouter.js";
import groupDetailRouter from "./routers/groupDetailRouter.js";
import profileRouter from "./routers/profileRouter.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", authRouter);
app.use(
  "/api",
  movieRouter,
  reviewRouter,
  favoriteRouter,
  selectRouter,
  groupsRouter,
  groupDetailRouter,
  profileRouter
);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

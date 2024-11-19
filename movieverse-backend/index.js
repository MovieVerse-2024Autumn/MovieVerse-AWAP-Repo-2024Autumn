import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import movieRouter from "./routers/movieRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";



const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", movieRouter, reviewRouter, favoriteRouter); 

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import express from "express";
import cors from "cors";

import movieRouter from "./routers/movieRouter.js";

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", movieRouter);

app.use((err, req, res, next) => {
  //console.error("Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

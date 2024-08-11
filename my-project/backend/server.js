import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;
// server.mjs
import scoredetail from "../route/srore.route.js";

import cors from "cors";

const mongoURI = "mongodb://localhost:27017/mygame";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use("/score", scoredetail);

app.get("/", (req, res) => {
  res.send("hi my server page");
});

app.listen(port, () => {
  console.log("server is running on port 3000");
});

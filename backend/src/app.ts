import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowOrigin = [
  "http://localhost:5173",
]

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

//shortId router
import shortIdRouter from "./routes/url.route.js";
app.use("/api/v1", shortIdRouter);

//public redirect route
import { redirectToOriginalUrl } from "./controllers/url.controller.js";
app.get("/:shortId", redirectToOriginalUrl);

app.get("/", (req, res) => {
  res.send("Hello Welcome to my App");
});

export default app;

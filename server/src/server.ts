import "dotenv/config";

import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import steamRoutes from "./routes/steam.routes";
import session from "express-session";
import { startDailySnapshotJob } from "./jobs/daily-snapshot.job";

startDailySnapshotJob();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({
    message: "PlayGraph API is running",
  });
});

app.get("/api/me", (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  res.json({ userId });
});

app.use("/api/steam", steamRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

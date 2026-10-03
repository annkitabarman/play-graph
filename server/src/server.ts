import "dotenv/config";

import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import steamRoutes from "./routes/steam.routes";
import session from "express-session";
import { startDailySnapshotJob } from "./jobs/daily-snapshot.job";
import { connectRedis } from "./lib/redis";

startDailySnapshotJob();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
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
async function startServer() {
  try {
    await connectRedis();

    console.log("Redis connected");
    const PORT = Number(process.env.PORT) || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

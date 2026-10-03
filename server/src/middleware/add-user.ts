import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import prisma from "../lib/prisma";

export async function ensureUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "You must be logged in.",
      });
    }

    await prisma.user.upsert({
      where: {
        clerkUserId: userId,
      },
      update: {},
      create: {
        clerkUserId: userId,
      },
    });

    next();
  } catch (error) {
    console.error("Failed to ensure user:", error);

    return res.status(500).json({
      message: "Failed to initialize user.",
    });
  }
}

import { Router } from "express";
import { getAuth } from "@clerk/express";
import axios from "axios";
import { getSteamProfile } from "../services/steam.service";
import prisma from "../lib/prisma";

const router = Router();

router.get("/connect", (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      message: "You must be logged in.",
    });
  }

  req.session.clerkUserId = userId;

  const returnUrl = "http://localhost:5000/api/steam/callback";

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnUrl,
    "openid.realm": "http://localhost:5000/",
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  const steamLoginUrl = `https://steamcommunity.com/openid/login?${params.toString()}`;

  res.redirect(steamLoginUrl);
});

router.get("/callback", async (req, res) => {
  try {
    const clerkUserId = req.session.clerkUserId;

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === "string") {
        params.append(key, value);
      }
    }

    // Tell Steam that we want to verify this response
    params.set("openid.mode", "check_authentication");

    const response = await axios.post(
      "https://steamcommunity.com/openid/login",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    // Check Steam's response
    if (!response.data.includes("is_valid:true")) {
      console.log("Steam verification FAILED");

      return res.status(401).json({
        message: "Steam authentication could not be verified.",
      });
    }

    const claimedId = req.query["openid.claimed_id"];

    if (typeof claimedId !== "string") {
      return res.status(400).json({
        message: "Steam ID missing.",
      });
    }

    const steamId = claimedId.split("/").pop();
    if (!steamId) {
      return res.status(400).json({
        message: "Could not extract Steam ID.",
      });
    }

    const user = await prisma.user.upsert({
      where: {
        clerkUserId,
      },

      update: {},

      create: {
        clerkUserId,
      },
    });

    const profile = await getSteamProfile(steamId);
    console.log(profile);

    const connectedAccount = await prisma.connectedAccount.upsert({
      where: {
        platform_externalId: {
          platform: "steam",
          externalId: steamId,
        },
      },

      update: {
        username: profile?.personaname,
        avatarUrl: profile?.avatarfull,
      },

      create: {
        userId: user.id,
        platform: "steam",
        externalId: steamId,
        username: profile?.personaname,
        avatarUrl: profile?.avatarfull,
      },
    });

    console.log("Connected account:", connectedAccount);

    return res.json({
      message: "Steam connected successfully!",
      steamId,
      account: connectedAccount,
    });
  } catch (error) {
    console.error("Steam verification failed:", error);

    return res.status(500).json({
      message: "Failed to verify Steam account.",
    });
  }
});

export default router;

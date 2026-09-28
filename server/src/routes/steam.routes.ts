import { Router } from "express";
import { getAuth } from "@clerk/express";
import axios from "axios";
import {
  getRecentlyPlayedGames,
  getSteamProfile,
} from "../services/steam.service";
import prisma from "../lib/prisma";
import { syncSteamAccount } from "../services/steam-sync.service";
import { updateCurrentlyPlaying } from "../services/currently-playing.service";

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

    if (!clerkUserId) {
      return res.status(401).json({
        message:
          "PlayGraph session expired. Please try connecting Steam again.",
      });
    }

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

    return res.redirect("http://localhost:5173");
  } catch (error) {
    console.error("Steam verification failed:", error);

    return res.status(500).json({
      message: "Failed to verify Steam account.",
    });
  }
});

router.get("/status", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        message: "You must be logged in!",
      });
    }

    const steamAccount = await prisma.connectedAccount.findFirst({
      where: {
        user: {
          clerkUserId: userId,
        },
        platform: "steam",
      },
      select: {
        id: true,
        externalId: true,
        username: true,
        avatarUrl: true,
      },
    });
    return res.json({
      connected: !!steamAccount,
      account: steamAccount ?? null,
    });
  } catch (err) {
    console.error("Failed to check Steam status: ", err);
    return res.status(500).json({
      message: "Failed to check Steam connection",
    });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "You must be logged in.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        connectedAccounts: {
          where: {
            platform: "steam",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const steamAccount = user.connectedAccounts[0];

    if (!steamAccount) {
      return res.status(400).json({
        message: "Steam account is not connected.",
      });
    }

    const result = await syncSteamAccount(user.id, steamAccount.externalId);

    return res.json({
      message: "Steam synced successfully.",
      ...result,
    });
  } catch (error) {
    console.error("Steam sync failed:", error);

    return res.status(500).json({
      message: "Failed to sync Steam.",
    });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId)
      return res.status(401).json({
        message: "You must be logged n=in.",
      });

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const games = await prisma.userGame.findMany({
      where: {
        userId: user.id,
      },
      include: {
        game: true,
      },
      orderBy: {
        playtimeMinutes: "desc",
      },
    });

    const totalPlayTimeMinutes = games.reduce(
      (total, game) => total + game.playtimeMinutes,
      0,
    );

    const mostPlayed = games.slice(0, 5);

    const recentlyPlayed = [...games]
      .filter((game) => game.lastPlayedAt !== null)
      .sort(
        (a, b) =>
          new Date(b.lastPlayedAt!).getTime() -
          new Date(a.lastPlayedAt!).getTime(),
      )
      .slice(0, 5);

    const playtimeDistribution = {
      unplayed: 0,
      under1Hour: 0,
      oneToFiveHours: 0,
      fiveToTwentyHours: 0,
      twentyToFiftyHours: 0,
      overFiftyHours: 0,
    };

    for (const userGame of games) {
      const hours = userGame.playtimeMinutes / 60;

      if (hours === 0) {
        playtimeDistribution.unplayed++;
      } else if (hours < 1) {
        playtimeDistribution.under1Hour++;
      } else if (hours < 5) {
        playtimeDistribution.oneToFiveHours++;
      } else if (hours < 20) {
        playtimeDistribution.fiveToTwentyHours++;
      } else if (hours < 50) {
        playtimeDistribution.twentyToFiftyHours++;
      } else {
        playtimeDistribution.overFiftyHours++;
      }
    }

    const genrePlaytime: Record<string, number> = {};
    for (const userGame of games) {
      for (const genre of userGame.game.genres) {
        genrePlaytime[genre] =
          (genrePlaytime[genre] ?? 0) + userGame.playtimeMinutes;
      }
    }

    const topGenres = Object.entries(genrePlaytime)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, playtimeMinutes]) => ({
        genre,
        playtimeMinutes,
      }));

    return res.json({
      total_games: games.length,
      total_play_time_minutes: totalPlayTimeMinutes,
      most_played: mostPlayed,
      recently_played: recentlyPlayed,
      top_genres: topGenres,
      playtime_distribution: [
        { bucket: "Unplayed", count: playtimeDistribution.unplayed },
        { bucket: "< 1 hour", count: playtimeDistribution.under1Hour },
        { bucket: "1-5 hours", count: playtimeDistribution.oneToFiveHours },
        { bucket: "5-20 hours", count: playtimeDistribution.fiveToTwentyHours },
        {
          bucket: "20-50 hours",
          count: playtimeDistribution.twentyToFiftyHours,
        },
        { bucket: "50+ hours", count: playtimeDistribution.overFiftyHours },
      ],
    });
  } catch (err) {
    console.error("Dashboard request failed.", err);
    return res.status(500).json({ message: "Failed to load dashboard." });
  }
});

router.get("/currently-playing", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "You need to be logged in." });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        connectedAccounts: {
          where: {
            platform: "steam",
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const steamAccount = user.connectedAccounts[0];

    if (!steamAccount)
      return res.status(400).json({ message: "Steam account not connected." });

    const session = await updateCurrentlyPlaying(
      userId,
      steamAccount.externalId,
    );

    if (!session) {
      return res.json({
        playing: false,
        game: null,
      });
    }

    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(session.detected_at).getTime()) / 1000,
    );

    return res.json({
      playing: session.playing,
      game: {
        app_id: session.app_id,
        game_name: session.game_name,
        image_url: `https://cdn.cloudflare.steamstatic.com/steam/apps/${session.app_id}/header.jpg`,
      },
      elapsed_seconds: session.playing
        ? elapsedSeconds
        : session.session_duration,
    });
  } catch (err) {
    console.error("Failed to get currently playing game:", err);

    return res.status(500).json({
      message: "Failed to get currently playing game.",
    });
  }
});

router.get("/recently-played", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "You need to be logged in." });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        connectedAccounts: {
          where: {
            platform: "steam",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const steamAccount = user.connectedAccounts[0];
    const games = await getRecentlyPlayedGames(steamAccount.externalId);

    return res.json({
      games: games,
    });
  } catch (err) {
    console.error("Failed to get recently played games.", err);
    return res
      .status(500)
      .json({ message: "Failed to get recently played games." });
  }
});
export default router;

import SteamNotConnected from "./SteamNotConnected";
import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import SteamConnectedHome from "./SteamConnectedHome";
import { getSteamStatus, syncSteam } from "../apis/steam.api";

function SteamContent() {
  const [steamConnected, setSteamConnected] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await getSteamStatus(getToken);

        setSteamConnected(response.connected);
      } catch (err) {
        setSteamConnected(false);
        console.log(err);
      }
    };

    checkConnection();
  }, [getToken]);

  useEffect(() => {
    if (!steamConnected) return;

    const sync = async () => {
      try {
        setSyncing(true);

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        await syncSteam(getToken, timezone);
      } catch (err) {
        console.error("Steam syncing failed:", err);
      } finally {
        setSyncing(false);
      }
    };

    sync();
  }, [steamConnected, getToken]);

  if (steamConnected === null)
    return <div>Checking your Steam connection...</div>;

  if (!steamConnected) return <SteamNotConnected />;

  if (syncing) {
    return <div>Syncing your Steam library...</div>;
  }
  return <SteamConnectedHome />;
}

function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090711] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Lavender glow */}
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-violet-600/20 blur-[150px]" />

        {/* Pink glow */}
        <div className="absolute -right-32 top-[15%] h-[500px] w-[500px] rounded-full bg-pink-500/15 blur-[150px]" />

        {/* Bottom glow */}
        <div className="absolute bottom-[-300px] left-[35%] h-[600px] w-[600px] rounded-full bg-fuchsia-500/10 blur-[160px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
          }}
        />
      </div>
      <SteamContent />
    </div>
  );
}

export default Dashboard;

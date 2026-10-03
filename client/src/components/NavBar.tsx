import { useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { RefreshCw } from "lucide-react";

import { UserButton, useAuth } from "@clerk/react";

import { Link } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";

import { getLastSynced, syncSteam } from "../apis/steam.api";

import SideBar from "./SideBar";

export default function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { getToken, isLoaded, isSignedIn } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["steam", "last-synced"],

    queryFn: () => getLastSynced(getToken),

    enabled: isLoaded && isSignedIn,
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const syncMutation = useMutation({
    mutationFn: () => syncSteam(getToken, timezone),
  });

  const lastSyncedAt = data?.last_synced_at;

  const formattedLastSynced = lastSyncedAt
    ? formatDistanceToNow(new Date(lastSyncedAt), {
        addSuffix: true,
      })
    : "never";

  return (
    <>
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="relative z-30 h-16 border-b border-white/5 bg-[#0b0912]">
        <div className="flex h-full items-center justify-between px-5 md:px-8">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Hamburger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={isSidebarOpen}
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.035] text-gray-400 transition hover:cursor-pointer hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-200"
            >
              <div className="flex w-[17px] flex-col gap-[4px]">
                <span className="h-[1.5px] w-full rounded-full bg-current" />
                <span className="h-[1.5px] w-full rounded-full bg-current" />
                <span className="h-[1.5px] w-3/4 rounded-full bg-current transition group-hover:w-full" />
              </div>
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-[17px] font-semibold tracking-tight text-white"
            >
              PlayGraph
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Sync Steam */}
            <div className="group relative">
              <button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium transition hover:cursor-pointer hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={syncMutation.isPending ? "animate-spin" : ""}
                />

                {syncMutation.isPending ? "Syncing..." : "Sync Steam"}
              </button>

              {/* Tooltip */}
              <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#171322] px-3 py-2 text-xs text-violet-200 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                {isLoading
                  ? "Loading last sync..."
                  : isError
                    ? "Unable to get last sync"
                    : `Last synced: ${formattedLastSynced}`}
              </div>
            </div>

            {/* Clerk */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 ring-2 ring-violet-400/10 hover:ring-violet-400/40 transition",
                },
              }}
            />
          </div>
        </div>
      </header>
    </>
  );
}

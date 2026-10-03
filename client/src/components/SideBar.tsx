import { Gamepad2, Library, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getSteamProfileDetails } from "../apis/steam.api";
import { STEAM_COMMUNITY_URL } from "../assets/constants/urls";
import { connectSteam } from "../apis/steam.api";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const location = useLocation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["steam", "profile"],
    queryFn: getSteamProfileDetails,
  });

  const errorStatus = (error as Error & { status?: number })?.status;

  const isDashboardActive = location.pathname === "/";
  const isLibraryActive = location.pathname === "/library";

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/5 bg-[#0b0912] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-5">
          <span className="text-[17px] font-semibold tracking-tight text-white">
            PlayGraph
          </span>

          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.035] text-gray-400 transition hover:cursor-pointer hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <div className="space-y-1">
            {/* Dashboard */}
            <Link
              to="/"
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isDashboardActive
                  ? "bg-violet-500/15 text-violet-200"
                  : "text-white/50 hover:bg-white/[0.035] hover:text-white"
              }`}
            >
              <Gamepad2
                size={18}
                className={
                  isDashboardActive
                    ? "text-violet-400"
                    : "text-white/40 group-hover:text-violet-300"
                }
              />

              <span>Dashboard</span>

              {isDashboardActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
              )}
            </Link>

            {/* Library */}
            <Link
              to="/library"
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isLibraryActive
                  ? "bg-violet-500/15 text-violet-200"
                  : "text-white/50 hover:bg-white/[0.035] hover:text-white"
              }`}
            >
              <Library
                size={18}
                className={
                  isLibraryActive
                    ? "text-violet-400"
                    : "text-white/40 group-hover:text-violet-300"
                }
              />

              <span>Library</span>

              {isLibraryActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          </div>
        </nav>

        {/* Steam profile */}
        <div className="shrink-0 border-t border-white/5 p-4">
          <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
            Steam Account
          </p>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-violet-500/20" />

              <div className="min-w-0 flex-1">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-2.5 w-32 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          )}

          {/* Steam not connected */}
          {!isLoading && errorStatus === 404 && (
            <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
              <p className="text-xs text-white/40">
                Steam account not connected
              </p>

              <button
                onClick={connectSteam}
                className="mt-2 text-xs font-medium text-violet-400 transition hover:text-violet-300 hover:cursor-pointer"
              >
                Connect Steam →
              </button>
            </div>
          )}

          {/* Other API error */}
          {!isLoading && isError && errorStatus !== 404 && (
            <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
              <p className="text-xs text-white/35">
                Unable to load Steam profile
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-xs font-medium text-violet-400 transition hover:text-violet-300"
              >
                Try again
              </button>
            </div>
          )}

          {/* Steam profile */}
          {!isLoading && !isError && data && (
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
              {data.avatar_url ? (
                <img
                  src={data.avatar_url}
                  alt={data.username}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-violet-400/10"
                />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-full bg-violet-500/20" />
              )}

              <div className="min-w-0">
                <a
                  href={`${STEAM_COMMUNITY_URL}/${data.steam_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium text-white transition hover:text-violet-300"
                >
                  {data.username}
                </a>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

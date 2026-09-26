import { Show, SignInButton, SignUpButton } from "@clerk/react";

const FONT_DISPLAY = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
const FONT_BODY = "'Inter', ui-sans-serif, system-ui, sans-serif";

function ControllerIcon() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="h-auto w-[220px] md:w-[280px]"
      role="img"
      aria-label="Game controller"
    >
      <defs>
        <linearGradient id="padGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path
        d="M55 30h90c22 0 38 18 40 40l6 34c2 14-9 26-22 26-7 0-13-3-17-9l-13-18a10 10 0 0 0-8-4H75a10 10 0 0 0-8 4l-13 18c-4 6-10 9-17 9-13 0-24-12-22-26l6-34c2-22 18-40 40-40Z"
        fill="url(#padGrad)"
        opacity="0.16"
        stroke="url(#padGrad)"
        strokeWidth="2.5"
      />
      {/* d-pad */}
      <rect x="52" y="62" width="10" height="28" rx="2" fill="#C4B5FD" />
      <rect x="43" y="71" width="28" height="10" rx="2" fill="#C4B5FD" />
      {/* action buttons */}
      <circle cx="140" cy="62" r="7" fill="#F0ABFC" />
      <circle cx="158" cy="76" r="7" fill="#F0ABFC" opacity="0.85" />
      <circle cx="140" cy="90" r="7" fill="#F0ABFC" opacity="0.7" />
      <circle cx="122" cy="76" r="7" fill="#F0ABFC" opacity="0.55" />
    </svg>
  );
}
export default function LoggedOutScreen() {
  return (
    <>
      <div
        className="flex h-screen flex-col overflow-hidden bg-[#080611] text-[#F1EEFB]"
        style={{ fontFamily: FONT_BODY }}
      >
        {/* Navbar */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-[7%]">
          <div
            className="flex items-center gap-2.5 text-xl font-semibold tracking-tight"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            <span className="text-2xl text-violet-400">◈</span>
            <span>PlayGraph</span>
          </div>

          <nav className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-lg px-[18px] py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:cursor-pointer">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-lg bg-violet-600 px-[18px] py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
            </Show>
          </nav>
        </header>

        {/* Hero */}
        <main className="relative flex min-h-0 flex-1 items-center overflow-hidden">
          <div className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[140px]" />
          <div className="absolute bottom-[-15%] left-[-10%] h-[340px] w-[340px] rounded-full bg-pink-500/10 blur-[140px]" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-10 px-[7%] md:grid-cols-[1.05fr_0.95fr]">
            {/* Left: copy */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                Live sync across your accounts
              </div>

              <h1
                className="text-[36px] leading-[1.08] tracking-[-0.02em] md:text-[48px]"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
              >
                See your gaming habits.
              </h1>

              <p className="mt-5 max-w-[460px] text-[16px] leading-7 text-gray-400">
                Connect Steam, Xbox, PlayStation and more. PlayGraph pulls your
                libraries and surfaces the patterns in what you actually play.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Show when="signed-out">
                  <SignUpButton mode="modal">
                    <button className="rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 px-6 py-3.5 font-medium text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30 hover:cursor-pointer">
                      Start exploring
                    </button>
                  </SignUpButton>
                </Show>

                <Show when="signed-in">
                  <button className="rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 px-6 py-3.5 font-medium text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30">
                    Open dashboard
                  </button>
                </Show>
              </div>
            </div>

            {/* Right: icon */}
            <div className="flex justify-center md:justify-end">
              <ControllerIcon />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

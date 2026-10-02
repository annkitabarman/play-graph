import { UserButton } from "@clerk/react";

export default function NavBar() {
  return (
    <header className="relative z-50 h-16 border-b border-white/10 bg-[#0b0912]/75 backdrop-blur-2xl">
      <div className="flex h-full items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            aria-label="Open navigation"
            className="group flex h-9 w-9 items-center justify-center rounded-xl
                         border border-white/5 bg-white/[0.035]
                         text-gray-400 transition
                         hover:border-violet-400/20
                         hover:bg-violet-500/10
                         hover:text-violet-200"
          >
            <div className="flex w-[17px] flex-col gap-[4px]">
              <span className="h-[1.5px] w-full rounded-full bg-current" />
              <span className="h-[1.5px] w-full rounded-full bg-current" />
              <span className="h-[1.5px] w-3/4 rounded-full bg-current transition group-hover:w-full" />
            </div>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-semibold tracking-tight">
              PlayGraph
            </span>
          </div>
        </div>

        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "h-9 w-9 ring-2 ring-violet-400/10 hover:ring-violet-400/40 transition",
            },
          }}
        />
      </div>
    </header>
  );
}

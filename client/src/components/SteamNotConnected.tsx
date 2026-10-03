import { connectSteam } from "../apis/steam.api";

export default function SteamNotConnected() {
  return (
    <main className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-6 md:px-10 lg:px-16 md:py-8">
      {/* Welcome */}
      <section
        className="relative overflow-hidden rounded-[28px]
                     border border-violet-300/15
                     bg-gradient-to-br
                     from-[#21163b]/90
                     via-[#171022]/90
                     to-[#120c1d]/95
                     p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                     backdrop-blur-2xl
                     md:p-11"
      >
        {/* Card glow */}
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-violet-500/20 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-pink-500/10 blur-[100px]" />

        {/* cute sparkle */}
        <span className="absolute right-8 top-7 rotate-12 text-lg text-pink-300/60">
          ✦
        </span>

        <span className="absolute right-16 top-12 text-xs text-violet-300/40">
          ˚₊‧
        </span>

        <div className="relative grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Copy */}
          <div>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full
                              border border-pink-300/15
                              bg-pink-400/10
                              px-3 py-1.5
                              text-[10px] font-semibold
                              uppercase tracking-[0.18em]
                              text-pink-200/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.9)]" />
              Ready to play
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl">
              Your games,
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                your little universe.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-violet-100/50">
              Connect your gaming accounts and turn your play history into a
              colorful little map of everything you love to play.
            </p>

            <button
              className="group mt-8 inline-flex items-center gap-3
                           rounded-xl border border-violet-300/20
                           bg-gradient-to-r from-violet-500/20 to-pink-500/10
                           px-5 py-3
                           text-sm font-medium text-violet-100
                           shadow-[0_8px_30px_rgba(139,92,246,0.12)]
                           transition duration-200
                           hover:-translate-y-0.5
                           hover:border-pink-300/30
                           hover:from-violet-500/30
                           hover:to-pink-500/20
                           hover:shadow-[0_12px_35px_rgba(236,72,153,0.15)]
                           hover:cursor-pointer"
              onClick={connectSteam}
            >
              <span className="text-base">🎮</span>
              Connect Steam
              <span className="text-violet-300 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* Mini graph */}
          <div
            className="relative min-h-[240px] overflow-hidden rounded-2xl
                         border border-white/10
                         bg-[#0c0915]/70
                         p-5
                         shadow-inner
                         backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/50">
                Your game graph
              </span>

              <span className="rounded-full border border-pink-300/10 bg-pink-400/5 px-2 py-1 text-[9px] text-pink-200/50">
                EMPTY
              </span>
            </div>

            {/* Decorative graph */}
            <div className="relative mt-6 h-36">
              {/* Lines */}
              <div className="absolute left-[18%] top-[38%] h-px w-[27%] rotate-[-18deg] bg-violet-300/20" />

              <div className="absolute left-[43%] top-[27%] h-px w-[28%] rotate-[28deg] bg-pink-300/20" />

              <div className="absolute left-[30%] top-[72%] h-px w-[38%] rotate-[-20deg] bg-fuchsia-300/20" />

              {/* Nodes */}
              <GraphNode
                position="left-[15%] top-[34%]"
                color="bg-violet-300"
              />

              <GraphNode
                position="left-[42%] top-[19%]"
                color="bg-pink-300"
                small
              />

              <GraphNode
                position="left-[68%] top-[51%]"
                color="bg-fuchsia-300"
              />

              <GraphNode
                position="left-[30%] top-[69%]"
                color="bg-purple-300"
                small
              />

              <GraphNode
                position="left-[80%] top-[23%]"
                color="bg-violet-200"
                small
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.08),transparent_65%)]" />
            </div>

            <p className="absolute bottom-5 left-5 right-5 text-[11px] leading-5 text-gray-600">
              Connect an account to populate your graph ✦
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function GraphNode({
  position,
  color,
  small = false,
}: {
  position: string;
  color: string;
  small?: boolean;
}) {
  return (
    <div
      className={`absolute ${position} ${
        small ? "h-2 w-2" : "h-3 w-3"
      } rounded-full ${color}
      shadow-[0_0_14px_currentColor]`}
    />
  );
}

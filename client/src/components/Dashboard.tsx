import NavBar from "./NavBar";
import SteamNotConnected from "./SteamNotConnected";

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
      <NavBar />
      <SteamNotConnected />
    </div>
  );
}

export default Dashboard;

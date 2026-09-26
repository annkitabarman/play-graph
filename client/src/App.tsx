import { Show } from "@clerk/react";
import LoggedOutScreen from "./components/LoggedOutScreen";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div>
      <Show when="signed-out">
        <LoggedOutScreen />
      </Show>
      <Show when={"signed-in"}>
        <Dashboard />
      </Show>
    </div>
  );
}

export default App;

import { Show, useAuth } from "@clerk/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

import LoggedOutScreen from "./components/LoggedOutScreen";
import Dashboard from "./components/Dashboard";
import Library from "./pages/Library";
import Layout from "./Layout";
import { setGetToken } from "./apis/auth-fetch";

function AuthenticatedApp() {
  const { getToken } = useAuth();

  setGetToken(getToken);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Show when="signed-out">
        <LoggedOutScreen />
      </Show>

      <Show when="signed-in">
        <AuthenticatedApp />
      </Show>
    </BrowserRouter>
  );
}

export default App;

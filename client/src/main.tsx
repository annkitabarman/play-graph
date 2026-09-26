import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/react";
import { dark } from "@clerk/ui/themes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#8b5cf6",
          colorBackground: "#080611",
          colorForeground: "#f5f3ff",
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);

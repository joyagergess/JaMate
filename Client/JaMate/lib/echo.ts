console.log("🚀 echo.ts file loaded");

import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { apiClient } from "../api/client";

(global as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: "reverb",
  key: "local",

  wsHost: "competing-trading-repository-reasonably.trycloudflare.com",
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ["wss"],

  authEndpoint:
    "https://competing-trading-repository-reasonably.trycloudflare.com/broadcasting/auth",

  auth: {
    headers: {
      Authorization: apiClient.defaults.headers.Authorization,
    },
  },
});

echo.connector.pusher.connection.bind("state_change", (states: any) => {
  console.log("🔄 WS state:", states);
});

echo.connector.pusher.connection.bind("connected", () => {
  console.log("✅ WebSocket connected");
});

echo.connector.pusher.connection.bind("error", (err: any) => {
  console.log("❌ WebSocket error", err);
});

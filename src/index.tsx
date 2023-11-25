import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { BASE_URL, VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID } from "./constants";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={VITE_AUTH0_DOMAIN}
      clientId={VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.href,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

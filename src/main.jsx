import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { TripsProvider } from "./context/TripsContext";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <TripsProvider>
        <App />
      </TripsProvider>
    </AuthProvider>
  </React.StrictMode>
);

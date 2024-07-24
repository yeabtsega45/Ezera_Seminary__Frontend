import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/user/ErrorPage.js";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// const ClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// axios.defaults.baseURL = "https://ezrabackend.online";
axios.defaults.baseURL = "http://localhost:5100";
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId={ClientID}> */}
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);

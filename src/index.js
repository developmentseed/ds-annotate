import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import MainContextProvider from "./contexts/MainContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
const basename = process.env.PUBLIC_URL;
root.render(
  <MainContextProvider>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="?project=:slug" element={<App />} />
      </Routes>
    </BrowserRouter>
  </MainContextProvider>
);

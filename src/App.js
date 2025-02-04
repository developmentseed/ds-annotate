import React from "react";
import { Sidebar } from "./components/Sidebar";
import { MapWrapper } from "./components/map";
import { Modal } from "./components/Modal";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import { SpinerLoader } from "./components/SpinerLoader";
import { ApiService } from "./components/ApiService";

function App() {
  return (
    <div className="flex h-screen font-sans relative">
      {/* Sidebar */}
      <div className="w-64 bg-gray-2000" aria-label="Sidebar">
        <Sidebar />
      </div>

      {/* Map Wrapper */}
      <div className="flex-1 bg-gray-100">
        <MapWrapper />
      </div>

      <Modal />
      <NotificationContainer />
      <SpinerLoader />

      {/* ApiService info*/}
      <ApiService />

    </div>
  );
}

export default App;

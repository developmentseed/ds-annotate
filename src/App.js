import React from "react";

import { Sidebar } from "./components/Sidebar";
import { MapWrapper } from "./components/map";
import { Modal } from "./components/Modal";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

function App() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-2000" aria-label="Sidebar">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100">
        <MapWrapper />
      </div>
      <Modal />
      <NotificationContainer />
    </div>
  );
}

export default App;

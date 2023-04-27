import React from "react";

import { Sidebar } from "./components/Sidebar";
import { MapWrapper } from "./components/map";
import { Modal } from "./components/Modal";

function App() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-2000" aria-label="Sidebar">
        <Sidebar></Sidebar>
      </div>
      <div className="flex-1 bg-gray-100">
        <MapWrapper />
      </div>
      <Modal></Modal>
    </div>
  );
}

export default App;

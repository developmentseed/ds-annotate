import React from "react";

import { Sidebar } from "./components/Sidebar";
import { MapWrapper } from "./components/map";
import { Modal } from "./components/Modal";

function App() {
  return (
    <div className="flex h-screen ">
      <div className="w-1/6" aria-label="Sidebar">
        <Sidebar></Sidebar>
      </div>
      <div className="w-5/6">
        <MapWrapper />
      </div>
      <Modal></Modal>
    </div>
  );
}

export default App;

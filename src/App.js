import React, { useState, useContext } from 'react';
import { Header } from './components/Header';
import { HiMenu, HiSearch } from 'react-icons/hi';
import { BsChevronDown } from 'react-icons/bs';
import { Sidebar } from './components/Sidebar';
import { MapWrapper } from './components/map';

function App() {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <div className="flex h-screen ">
      <div className="w-1/6" aria-label="Sidebar">
      <Sidebar></Sidebar>
      </div>
      <div className="w-5/6">
         <MapWrapper/>
      </div>
    </div>
  );
}

export default App;

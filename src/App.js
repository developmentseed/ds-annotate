import React, { useState, useContext } from 'react';
import { Header } from './components/Header';
import { HiMenu, HiSearch } from 'react-icons/hi';
import { BsChevronDown } from 'react-icons/bs';
import { ProjectsMenu } from './components/ProjectsMenu';
import { ClassesMenu } from './components/ClassesMenu';
import { ItemsMenu } from './components/ItemsMenu';
import { DownloadData } from './components/DownloadData';
import { MapWrapper } from './components/map';

function App() {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <div className="flex">
      <div
        className={`border border-slate-300 h-screen p-5 pt-2 w-60  ${
          openSidebar ? 'w-1/6' : 'w-20'
        } relative duration-300`}
      >
        <Header
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        ></Header>
        <ProjectsMenu></ProjectsMenu>
        <ClassesMenu></ClassesMenu>
        <ItemsMenu></ItemsMenu>
        <DownloadData></DownloadData>
      </div>
      <div className="w-5/6">
         <MapWrapper/>
      </div>
    </div>
  );
}

export default App;

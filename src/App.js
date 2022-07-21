import React, { useState } from 'react';
import { Header } from './components/Header';
import { HiMenu, HiSearch } from 'react-icons/hi';
import { BsChevronDown } from 'react-icons/bs';
import { ProjectsMenu } from './components/ProjectsMenu';
import { ClassesMenu } from './components/ClassesMenu';
import { ItemsMenu } from './components/ItemsMenu';

import { Map } from './components/Map';

function App() {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <div className="flex">
      <div
        className={`border border-slate-300 h-screen p-5 pt-2 w-60  ${
          openSidebar ? 'w-72' : 'w-20'
        } relative duration-300`}
      >
        <Header
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        ></Header>
        <ProjectsMenu></ProjectsMenu>
        <ClassesMenu></ClassesMenu>
        <ItemsMenu></ItemsMenu>
      </div>
      <div className="p-7">
        <Map />
      </div>
    </div>
  );
}

export default App;

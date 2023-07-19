import React from "react";

import { Header } from "./Header";
import { Projects } from "./Projects";
import { Classes } from "./Classes";
import { Items } from "./Items";
import { MenuExpData } from "./MenuExpData";
import { EncodeItems } from "./EncodeItems";

export const Sidebar = () => {
  return (
    <>
      <aside>
        <Header />
        <div className="overflow-y-auto pr-2 pl-2 scroll-smooth hover:scroll-auto overscroll-y-contain h-[calc(100vh-50px)]">
          <Projects />
          <Classes />
          <EncodeItems />
          <Items />
          <MenuExpData />
        </div>
      </aside>
    </>
  );
};

import React from "react";

import { Header } from "./Header";
import { MenuProjects } from "./MenuProjects";
import { MenuClass } from "./MenuClass";
import { MenuItems } from "./MenuItems";
import { MenuExpData } from "./MenuExpData";
import { MenuActions } from "./MenuActions";
import { SegmentAM } from "./SegmentAM";

const MenuSection = ({ children }) => (
  <>
    {children}
    <div className="border-t border-gray-200 my-1"></div>
  </>
);
export const Sidebar = () => {
  return (
    <>
      <aside>
        <div className="overflow-y-auto pt-2 pb-2 pl-3">
          <Header />
        </div>
        <div className="overflow-y-auto pr-2 pl-2">
          <MenuSection>
            <MenuProjects />
          </MenuSection>
          <MenuSection>
            <MenuClass />
          </MenuSection>
          <MenuSection>
            <MenuItems />
          </MenuSection>
          <MenuSection>
            <MenuActions />
          </MenuSection>
          <MenuSection>
            <MenuExpData />
          </MenuSection>
        </div>
      </aside>
      <div className="fixed bottom-2 mx-auto pr-2 pl-2">
        <SegmentAM />
      </div>
    </>
  );
};

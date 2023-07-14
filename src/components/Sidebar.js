import React from "react";

import { Header } from "./Header";
import { Projects } from "./Projects";
import { Classes } from "./Classes";
import { Items } from "./Items";
import { MenuExpData } from "./MenuExpData";
import { ItemsDataActions } from "./ItemsDataActions";
import { EncodeItems } from "./EncodeItems";

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
        <Header />
        <div className="overflow-y-auto pr-2 pl-2 scroll-smooth hover:scroll-auto overscroll-y-contain h-[calc(100vh-50px)]">
          <MenuSection>
            <Projects />
          </MenuSection>
          <MenuSection>
            <Classes />
          </MenuSection>
          <MenuSection>
            <EncodeItems />
          </MenuSection>
          <MenuSection>
            <Items />
          </MenuSection>
          <MenuSection>
            <MenuExpData />
          </MenuSection>
        </div>
      </aside>
    </>
  );
};

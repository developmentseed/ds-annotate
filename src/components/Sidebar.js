import React from "react";

import { Header } from "./Header";
import { Projects } from "./Projects";
import { Classes } from "./Classes";
import { Items } from "./Items";
import { MenuExpData } from "./MenuExpData";
import { MenuDataActions } from "./MenuDataActions";
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
        <div className="overflow-y-auto pt-2 pb-2 pl-3">
          <Header />
        </div>
        <div className="overflow-y-auto pr-2 pl-2">
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
            <MenuDataActions />
          </MenuSection>
          <MenuSection>
            <MenuExpData />
          </MenuSection>
        </div>
      </aside>
    </>
  );
};

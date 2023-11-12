import React, { useState } from "react";
import { MenuTemplate } from "./MenuTemplate";
import { BsLayoutWtf } from "react-icons/bs";
import { Decode } from "./Decode";

export const DecodeItems = () => {
  const [openMenu, setOpenMenu] = useState(true);
  return (
    <MenuTemplate
      title={"Prompts"}
      icon={<BsLayoutWtf />}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
    >
      <Decode />
    </MenuTemplate>
  );
};

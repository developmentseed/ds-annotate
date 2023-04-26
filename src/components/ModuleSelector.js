import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export const ModuleSelector = () => {
  const { dispatchSetActiveModule } = useContext(MainContext);

  const setActiveModule = (mapingModule) => {
    dispatchSetActiveModule({
      type: "SET_ACTIVE_MODULE",
      payload: mapingModule,
    });
  };

  return (
    <div className="flex flex-row mt-3">
      <button
        type="button"
        className="custom_button_2 mr-1"
        title="Use SAM"
        onClick={() => {
          setActiveModule("SAM");
        }}
      >
        SAM
      </button>
      <button
        type="button"
        className="custom_button_2"
        onClick={() => {
          setActiveModule("MAGIC_WAND");
        }}
        title="Use Magic Wand"
      >
        Magic wand
      </button>
    </div>
  );
};

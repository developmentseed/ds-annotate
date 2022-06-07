import React, { createContext, useReducer, useState } from 'react';
import projects from './../../static/projects.json';
import {
  downloadGeojsonReducer,
  downloadInJOSMReducer,
  activeClassReducer
} from './../reducers';

export const MainContext = createContext();

const MainContextProvider = (props) => {
  const [activeClass, dispatchSetActiveClass] = useReducer(
    activeClassReducer,
    null
  );

  const [dlGeojson, dispatchDLGeojson] = useReducer(
    downloadGeojsonReducer,
    false
  );

  const [dlInJOSM, dispatchDLInJOSM] = useReducer(downloadInJOSMReducer, false);

  return (
    <MainContext.Provider
      value={{
        projects,
        activeClass,
        dispatchSetActiveClass,
        dlGeojson,
        dispatchDLGeojson,
        dlInJOSM,
        dispatchDLInJOSM
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;

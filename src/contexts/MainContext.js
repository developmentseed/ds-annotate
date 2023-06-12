import { createContext, useReducer } from "react";
import propTypes from "prop-types";

import projects from "./../static/projects.json";
import {
  downloadGeojsonReducer,
  downloadInJOSMReducer,
  activeClassReducer,
  activeProjectReducer,
  itemsReducer,
  highlightedItemReducer,
  pointsSelectorReducer
} from "./../reducers";

export const MainContext = createContext();

const MainContextProvider = (props) => {
  const [activeProject, dispatchSetActiveProject] = useReducer(
    activeProjectReducer,
    null
  );

  const [activeClass, dispatchSetActiveClass] = useReducer(
    activeClassReducer,
    null
  );

  const [items, dispatchSetItems] = useReducer(itemsReducer, []);

  const [highlightedItem, dispatchSetHighlightedItem] = useReducer(
    highlightedItemReducer,
    null
  );

  const [dlGeojson, dispatchDLGeojson] = useReducer(
    downloadGeojsonReducer,
    false
  );

  const [dlInJOSM, dispatchDLInJOSM] = useReducer(downloadInJOSMReducer, false);

  const [pointsSelector, dispatchSetPointsSelector] = useReducer(
    pointsSelectorReducer,
    []
  );

  // const [items, dispatchSetItems] = useReducer(itemsReducer, []);

  return (
    <MainContext.Provider
      value={{
        projects,
        activeProject,
        dispatchSetActiveProject,
        activeClass,
        dispatchSetActiveClass,
        items,
        highlightedItem,
        dispatchSetHighlightedItem,
        dispatchSetItems,
        dlGeojson,
        dispatchDLGeojson,
        dlInJOSM,
        dispatchDLInJOSM,
        pointsSelector,
        dispatchSetPointsSelector
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainContextProvider.propTypes = {
  children: propTypes.node,
};

export default MainContextProvider;

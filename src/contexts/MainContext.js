import { createContext, useReducer, useState } from "react";
import propTypes from "prop-types";

import projects from "./../static/projects.json";
import {
  downloadGeojsonReducer,
  downloadInJOSMReducer,
  activeClassReducer,
  activeProjectReducer,
  itemsReducer,
  highlightedItemReducer,
  pointsSelectorReducer,
  encodeItemsReducer,
  activeEncodeImage,
  activeDecoderType,
} from "./../reducers";

export const MainContext = createContext();

const MainContextProvider = (props) => {
  const [map, setMap] = useState();

  const [wand, setWand] = useState(null);

  const [spinnerLoading, setSpinnerLoading] = useState(false);

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
    {}
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

  const [encodeItems, dispatchEncodeItems] = useReducer(encodeItemsReducer, []);

  const [activeEncodeImageItem, dispatchActiveEncodeImageItem] = useReducer(
    activeEncodeImage,
    null
  );

  const [displayModal, setDisplayModal] = useState(() => {
    const saved = localStorage.getItem("modalDisplay");
    if (!saved) return "block";
    return "none";
  });

  const [decoderType, dispatchDecoderType] = useReducer(
    activeDecoderType,
    "single_point"
  );

  return (
    <MainContext.Provider
      value={{
        map,
        setMap,
        wand,
        setWand,
        projects,
        activeProject,
        dispatchSetActiveProject,
        activeClass,
        dispatchSetActiveClass,
        items,
        dispatchSetItems,
        highlightedItem,
        dispatchSetHighlightedItem,
        dlGeojson,
        dispatchDLGeojson,
        dlInJOSM,
        dispatchDLInJOSM,
        pointsSelector,
        dispatchSetPointsSelector,
        encodeItems,
        dispatchEncodeItems,
        displayModal,
        setDisplayModal,
        activeEncodeImageItem,
        dispatchActiveEncodeImageItem,
        spinnerLoading,
        setSpinnerLoading,
        decoderType,
        dispatchDecoderType,
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

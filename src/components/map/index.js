import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import T from "prop-types";
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls } from "ol/control";
import MagicWandInteraction from "ol-magic-wand";
import "ol/ol.css";
import {
  Modify,
  Select,
  defaults as defaultInteractions,
} from "ol/interaction";

import {
  osm,
  vector,
  mainLayer,
  vectorSegData,
  vectorHighlighted,
  vectorPointSelector,
  encodeMapViews,
  encodeMapViewHighlighted,
} from "./layers";
import { MainContext } from "../../contexts/MainContext";
import { ProjectLayer } from "./ProjectLayer";
import { SpinerLoader } from "./../SpinerLoader";
import { MagicWand } from "./MagicWand";

export function MapWrapper({ children }) {
  // Import values from main context
  const {
    map,
    setMap,
    setWand,
    activeProject,
    items,
    dispatchSetItems,
    highlightedItem,
  } = useContext(MainContext);

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  // State for events on the map
  const [event, setEvent] = useState(null);

  // Initialize all the map components
  useLayoutEffect(() => {
    const initWand = new MagicWandInteraction({
      layers: [mainLayer],
      hatchLength: 4,
      hatchTimeout: 300,
      waitClass: "magic-wand-loading",
      addClass: "magic-wand-add",
    });
    const view = new View({
      projection: "EPSG:3857",
      center: [0, 0],
      zoom: 2,
    });

    const interactions = {
      doubleClickZoom: true,
      keyboardPan: false,
      keyboardZoom: false,
      mouseWheelZoom: false,
      pointer: false,
      select: false,
    };

    const select = new Select({
      wrapX: false,
    });

    const modify = new Modify({
      features: select.getFeatures(),
    });

    const initialMap = new Map({
      target: mapElement.current,
      controls: defaultControls().extend([]),
      interactions: defaultInteractions(interactions).extend([
        initWand,
        select,
        modify,
      ]),
      layers: [
        osm,
        mainLayer,
        vector,
        vectorSegData,
        vectorHighlighted,
        vectorPointSelector,
        encodeMapViews,
        encodeMapViewHighlighted,
      ],
      view: view,
    });

    // // Add hash map in the url
    // initialMap.on("moveend", function () {
    //   const view = initialMap.getView();
    //   const zoom = view.getZoom();
    //   const coord = view.getCenter();
    //   window.location.hash = `#map=${Math.round(zoom)}/${coord[0]}/${coord[1]}`;
    // });

    setMap(initialMap);
    setWand(initWand);
  }, []);

  useEffect(() => {
    if (activeProject) {
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: [],
      });
    }
  }, [activeProject]);

  const drawSegments = (e) => {
    setEvent(e);
  };

  const handleOnKeyDown = (e) => {
    //Fetch predition from SAM
  };

  const handleClick = (e) => {
    // setLoading(true);
  };

  return (
    <>
      <div
        ref={mapElement}
        style={{ height: "100%", width: "100%", background: "#456234" }}
        className="parent relative"
        onClick={handleClick}
        onKeyPress={drawSegments}
        onKeyDown={handleOnKeyDown}
        tabIndex={0}
      >
        <MagicWand event={event} />
        {activeProject && (
          <ProjectLayer
            project={activeProject}
            items={items}
            highlightedItem={highlightedItem}
          />
        )}
        {children}
      </div>
    </>
  );
}

MapWrapper.propTypes = {
  project: T.object,
  children: T.node,
};

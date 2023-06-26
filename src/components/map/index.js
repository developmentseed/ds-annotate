import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useContext,
} from "react";
import T from "prop-types";
import Map from "ol/Map";
import View from "ol/View";
import { ScaleLine, FullScreen, defaults as defaultControls } from "ol/control";
import MagicWandInteraction from "ol-magic-wand";
import { Feature } from "ol";
import Polygon from "ol/geom/Polygon";
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
} from "./layers";
import { MapContext } from "../../contexts/MapContext";
import { MainContext } from "../../contexts/MainContext";
import { ProjectLayer } from "./ProjectLayer";
import { simplifyFeatures } from "./../../utils/transformation";
import { features2olFeatures, olFeatures2Features } from "../../utils/convert";
import { openDatabase, storeItems } from "./../../store/indexedDB";

import { SpinerLoader } from "./../SpinerLoader";
import { SegmentAM } from "./../SegmentAM";
import { getMaxIdPerClass } from "./../../utils/utils";
import { MenuEncodeItems } from "./../MenuEncodeItems";

export function MapWrapper({ children }) {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const [wand, setWand] = useState(null);
  const {
    activeProject,
    activeClass,
    items,
    dispatchSetItems,
    highlightedItem,
  } = useContext(MainContext);
  const [loading, setLoading] = useState(false);

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

    const scaleLine = new ScaleLine({
      units: "metric",
      minWidth: 40,
      maxWidth: 40,
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
      ],
      view: view,
    });

    // Add hash map in the url
    initialMap.on("moveend", function () {
      const view = initialMap.getView();
      const zoom = view.getZoom();
      const coord = view.getCenter();
      window.location.hash = `#map=${zoom}/${coord[0]}/${coord[1]}`;
    });

    setMap(initialMap);
    setWand(initWand);
  }, []);

  const setItems = useCallback(
    (items) => {
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: items,
      });
    },
    [dispatchSetItems]
  );

  useEffect(() => {
    if (activeProject) {
      setItems([]);
    }
  }, [activeProject, setItems]);

  const drawSegments = async (e) => {
    if (e.type === "keypress" && e.key === "s") {
      let contours = wand.getContours();
      if (!contours) return;
      let rings = contours.map((c) =>
        c.points.map((p) => map.getCoordinateFromPixel([p.x, p.y]))
      );
      try {
        const oLFeature = new Feature({
          geometry: new Polygon(rings),
          project: activeProject.properties.name,
          class: activeClass.name,
          color: activeClass.color,
          id: getMaxIdPerClass(items, activeClass),
        });
        //Simplify features
        const features = olFeatures2Features([oLFeature]);
        // const simpleFeatures = simplifyFeatures(features, 0.000001);
        // Insert the first items
        const feature = features[0];
        const oLFeatures = features2olFeatures([feature]);
        setItems([...items, oLFeatures[0]]);
        //insert feature into the DB
        await openDatabase();
        const id = `${feature.properties.id}${feature.properties.class}`;
        await storeItems.addData({ ...feature, id });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnKeyDown = (e) => {
    //Fetch predition from SAM
  };

  const handleClick = (e) => {
    // setLoading(true);
  };

  return (
    <MapContext.Provider value={{ map }}>
      <div
        ref={mapElement}
        style={{ height: "100%", width: "100%", background: "#456234" }}
        className="parent relative"
        onClick={handleClick}
        onKeyPress={drawSegments}
        onKeyDown={handleOnKeyDown}
        tabIndex={0}
      >
        {loading && <SpinerLoader loading={loading} />}
        <SegmentAM setLoading={setLoading} />
        {activeProject && (
          <ProjectLayer
            project={activeProject}
            items={items}
            highlightedItem={highlightedItem}
          />
        )}
        {children}
      </div>
      <MenuEncodeItems />
    </MapContext.Provider>
  );
}

MapWrapper.propTypes = {
  project: T.object,
  children: T.node,
};

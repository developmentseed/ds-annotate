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
  vectorPointSelector
} from "./layers";
import { MapContext } from "../../contexts/MapContext";
import { MainContext } from "../../contexts/MainContext";
import { ProjectLayer } from "./ProjectLayer";
import { simplifyOlFeature } from "./../../utils/transformation";

import { getCanvas } from "./../../utils/canvas";
import { getPrediction } from "../../utils/samApi";
import { encodeImageExample } from "../../utils/encodeRespose";

import { SpinerLoader } from './../SpinerLoader';

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
    activeModule,
    dispatchSetItems,
    highlightedItem
  } = useContext(MainContext);

  const [idItem, setIdItem] = useState(1);
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
      controls: defaultControls().extend([new FullScreen(), scaleLine]),
      interactions: defaultInteractions(interactions).extend([
        initWand,
        select,
        modify,
      ]),
      layers: [osm, mainLayer, vector, vectorSegData, vectorHighlighted, vectorPointSelector],
      view: view,
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


  const handleClick = (e) => {
    // console.log(activeModule)
    // if (activeModule == "SAM") {
    //   //Fetch predition from SAM
    //   //Enable loading
    //   setLoading(true);
    //   getPrediction(getCanvas(map), {
    //     "image_embeddings": encodeImageExample,
    //     "image_shape": map.getSize(),
    //     "input_label": 1,
    //     "input_point": [e.clientX, e.clientY]
    //   }).then(response => {
    //     console.log("image_embedding");
    //     console.log(JSON.stringify(response.image_embedding));
    //     console.log("masks")
    //     console.log(JSON.stringify(response.masks));
    //     setLoading(false);
    //   }).catch(error => {
    //     setLoading(false);
    // });
    // }
  };

  const drawSegments = (e) => {
    if (e.type === "keypress" && e.key === "s") {
      let contours = wand.getContours();
      if (!contours) return;
      let rings = contours.map((c) =>
        c.points.map((p) => map.getCoordinateFromPixel([p.x, p.y]))
      );

      const oLFeature = new Feature({
        geometry: new Polygon(rings),
        project: activeProject.properties.name,
        class: activeClass.name,
        color: activeClass.color,
        id: idItem,
      });
      const newIdItem = idItem + 1;
      setIdItem(newIdItem);
      const newOLFeature = simplifyOlFeature(oLFeature);
      setItems([...items, newOLFeature]);
    }
  };

  return (
    <MapContext.Provider value={{ map }}>
      <div
        ref={mapElement}
        style={{ height: "100%", width: "100%", background: "#456234" }}
        // onClick={handleClick}
        onKeyPress={drawSegments}
        tabIndex={0}
      >
        {loading && <SpinerLoader loading={loading} />}
        {activeProject && (
          <ProjectLayer
            project={activeProject}
            items={items}
            highlightedItem={highlightedItem}
            // pointsSelector={pointsSelector}
          />
        )}
        {children}
      </div>
    </MapContext.Provider>
  );
}

MapWrapper.propTypes = {
  project: T.object,
  children: T.node,
};

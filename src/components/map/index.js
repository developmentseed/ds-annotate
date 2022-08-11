import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';
import T from 'prop-types';
import Map from 'ol/Map';
import View from 'ol/View';
import { ScaleLine, FullScreen, defaults as defaultControls } from 'ol/control';
import MagicWandInteraction from 'ol-magic-wand';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import 'ol/ol.css';
import {
  Modify,
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction';

import { osm, vector, mainLayer, vectorSegData } from './layers';
import { MapContext } from '../../contexts/MapContext';
import { MainContext } from '../../contexts/MainContext';
import { ProjectLayer } from './ProjectLayer';
import { simplifyFeature } from './../../utils/transformation';

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
    dispatchSetItems
  } = useContext(MainContext);

  useLayoutEffect(() => {
    const initWand = new MagicWandInteraction({
      layers: [mainLayer],
      hatchLength: 4,
      hatchTimeout: 300,
      waitClass: 'magic-wand-loading',
      addClass: 'magic-wand-add',
    });
    const view = new View({
      projection: 'EPSG:3857',
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
      units: 'metric',
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
      layers: [osm, mainLayer, vector, vectorSegData],
      view: view,
    });

    setMap(initialMap);
    setWand(initWand);
  }, []);

  useEffect(() => {
    if (activeProject) {
      SetItems([]);
    }
    console.log(activeProject);
  }, [activeProject]);

  const drawSegments = (e) => {
    if (e.type === 'keypress') {
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
      });
      const newOLFeature = simplifyFeature(oLFeature)
      SetItems([...items, oLFeature, newOLFeature]);
    }
  };

  const SetItems = (items) => {
    dispatchSetItems({
      type: 'SET_ITEMS',
      payload: items,
    });
  };
  const handleClick = (e) => {
    console.log(`Start drawing...using ${e.type}`);
  };

  return (
    <MapContext.Provider value={{ map }}>
      <div
        ref={mapElement}
        style={{ height: '100%', width: '100%', background: '#456234' }}
        onContextMenu={handleClick}
        onKeyPress={drawSegments}
        tabIndex={0}
      >
        {activeProject && (
          <ProjectLayer project={activeProject} items={items} />
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

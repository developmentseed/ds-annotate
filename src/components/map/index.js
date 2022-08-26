import {
  useState,
  useEffect,
  useRef,
  useCallback,
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

import {
  osm,
  vector,
  mainLayer,
  vectorSegData,
  vectorHighlighted,
} from './layers';
import { MapContext, MagicWandContext} from '../../contexts/MapContext';
import { MainContext } from '../../contexts/MainContext';
import { ProjectLayer } from './ProjectLayer';
import { simplifyFeature } from './../../utils/transformation';
import { Viewer } from './Viewer';

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

  const [viewerScale, setViewerScale] = useState({w:null,h:null});


  const scaleLine = new ScaleLine({
    units: 'metric',
    minWidth: 40,
    maxWidth: 40,
  });

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


    const initialMap = new Map({
      target: mapElement.current,
      controls: defaultControls().extend([scaleLine]),
      interactions: defaultInteractions(interactions).extend([
        initWand,
        select,
        modify,
      ]),
      layers: [osm, mainLayer, vector, vectorSegData, vectorHighlighted],
      view: view,
    });

    setMap(initialMap);
    setWand(initWand);
  }, []);

  const setItems = useCallback((items) => {
    dispatchSetItems({
      type: 'SET_ITEMS',
      payload: items,
    });
  }, [dispatchSetItems]);

  useEffect(() => {
    if (activeProject) {
      setItems([]);
    }
  }, [activeProject, setItems]);

  const handleClick = (e) => {
    console.log(`Start drawing...using ${e.type}`);
  };

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
      const newOLFeature = simplifyFeature(oLFeature);
      setItems([...items, newOLFeature]);
    }
  };

      useEffect(() => {
      if (!map) return;
      map.updateSize();
      map.render();
    }, [viewerScale]);
  return (
    <MapContext.Provider value={{ map }}>
        <MagicWandContext.Provider value={{ wand }}>
      <div
        ref={mapElement}
        style={{ height: viewerScale.h ? `${viewerScale.h}px` : '100%' , width: viewerScale.w ? `${viewerScale.w}px` : '100%' , background: '#456234' }}
        onContextMenu={handleClick}
        onKeyPress={drawSegments}
        tabIndex={0}
        id = "map"
      >
        {activeProject && (
          <ProjectLayer
            project={activeProject}
            items={items}
            highlightedItem={highlightedItem}
          />
        )}
        {children}
      </div>
      <Viewer viewerScale={viewerScale} setViewerScale={ setViewerScale}></Viewer>
      </MagicWandContext.Provider>
    </MapContext.Provider>
  );
}

MapWrapper.propTypes = {
  project: T.object,
  children: T.node,
};

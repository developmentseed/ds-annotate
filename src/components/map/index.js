import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext
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
  defaults as defaultInteractions
} from 'ol/interaction';

import { osm, vector, mainLayer, vectorSegData } from './layers';
import { MapContext } from '../../contexts/MapContext';
import { MainContext } from '../../contexts/MainContext';
import { ProjectLayer } from './ProjectLayer';
import { downloadGeojsonFile, downloadInJOSM } from './../../utils/download';
import { getGeojson } from './../../utils/featureCollection';

export function MapWrapper({ children }) {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  
  const [wand, setWand] = useState(null);
  const [projectSegData, setProjectSegData] = useState([]);
  const {
    activeProject,
    activeClass,
    dlGeojson,
    dispatchDLGeojson,
    dlInJOSM,
    dispatchDLInJOSM
  } = useContext(MainContext);

  useLayoutEffect(() => {
    const initWand = new MagicWandInteraction({
      layers: [mainLayer],
      hatchLength: 4,
      hatchTimeout: 300,
      waitClass: 'magic-wand-loading',
      addClass: 'magic-wand-add'
    });
    const view = new View({
      projection: 'EPSG:3857',
      center: [0, 0],
      zoom: 2
    });

    const interactions = {
      doubleClickZoom: true,
      keyboardPan: false,
      keyboardZoom: false,
      mouseWheelZoom: false,
      pointer: false,
      select: false
    };

    const select = new Select({
      wrapX: false
    });

    const modify = new Modify({
      features: select.getFeatures()
    });

    const scaleLine = new ScaleLine({
      units: 'metric',
      minWidth: 40,
      maxWidth: 40
    });

    const initialMap = new Map({
      target: mapElement.current,
      controls: defaultControls().extend([new FullScreen(), scaleLine]),
      interactions: defaultInteractions(interactions).extend([
        initWand,
        select,
        modify
      ]),
      layers: [osm, mainLayer, vector, vectorSegData],
      view: view
    });

    setMap(initialMap);
    setWand(initWand);
  }, []);

  // Download geojson
  useEffect(() => {
    if (dlGeojson && vectorSegData.getSource()) {
      dispatchDLGeojson({
        type: 'DOWNLOAD_GEOJSON',
        payload: { status: false }
      });
      var geojson = getGeojson(vectorSegData);
      const fileName = `${activeProject.properties.name.replace(/\s/g, '_')}.geojson`;
      downloadGeojsonFile(geojson, fileName);
    }
  }, [dlGeojson]);

  // Download in JOSM
  useEffect(() => {
    if (dlInJOSM && vectorSegData.getSource()) {
      dispatchDLInJOSM({
        type: 'DOWNLOAD_IN_JOSM',
        payload: { status: false }
      });
      var geojson = getGeojson(vectorSegData);
      downloadInJOSM(geojson, activeProject);
    }
  }, [dlInJOSM]);

  useEffect(() => {
    if (activeProject) {
      setProjectSegData([]);
    }
    console.log(activeProject)
  }, [activeProject]);

  const drawSegments = (e) => {
    if (e.type === 'keypress') {
      let contours = wand.getContours();
      if (!contours) return;
      let rings = contours.map((c) =>
        c.points.map((p) => map.getCoordinateFromPixel([p.x, p.y]))
      );


      console.log(activeClass)
      const feature = new Feature({
        geometry: new Polygon(rings),
        project: activeProject.properties.name,
        class: activeClass.name,
        color: activeClass.color
      });
      // ...simplifyGeo(feature)
      setProjectSegData([...projectSegData, feature]);
    }
  };

  const handleClick = (e) => {
    console.log(`Start drawing...using ${e.type}`);
  };

  return (
    <MapContext.Provider value={{ map }}>
    <div
        ref={mapElement}
        style={{height: '100%', width: '100%', background:"#456234"}}
        onContextMenu={handleClick}
        onKeyPress={drawSegments}
        tabIndex={0}
      >
        {activeProject && (
          <ProjectLayer project={activeProject} projectSegData={projectSegData} />
        )}
        {children}
      </div>
     </MapContext.Provider>
  );
}

MapWrapper.propTypes = {
  project: T.object,
  children: T.node
};


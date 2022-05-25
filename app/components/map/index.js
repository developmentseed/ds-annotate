import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import T from 'prop-types';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions } from 'ol/interaction';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import MagicWandInteraction from 'ol-magic-wand';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import 'ol/ol.css';

import { osm, vector, mainLayer, vectorSegData } from './layers';
import { MapContext } from '../../contexts/MapContext';
import { ProjectLayer } from './ProjectLayer';

export function MapWrapper({ project, children }) {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const [wand, setWand] = useState(null);
  const [projectSegData, setProjectSegData] = useState([]);

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

    const initialMap = new Map({
      target: mapElement.current,
      controls: defaultControls().extend([new FullScreen()]),
      interactions: defaultInteractions().extend([initWand]),
      layers: [osm, mainLayer, vector, vectorSegData],
      view: view
    });

    setMap(initialMap);
    setWand(initWand);
  }, []);

  const drawSegments = (e) => {
    if (e.type == 'keypress') {
      let contours = wand.getContours();
      if (!contours) return;
      let rings = contours.map((c) =>
        c.points.map((p) => map.getCoordinateFromPixel([p.x, p.y]))
      );
      const feature = new Feature({
        geometry: new Polygon(rings),
        name: 'My Polygon'
      });
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
        style={{ height: 'calc(100vh - 60px)', width: '100%' }}
        onContextMenu={handleClick}
        onKeyPress={drawSegments}
        tabIndex={0}
      >
        {project && (
          <ProjectLayer project={project} projectSegData={projectSegData} />
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

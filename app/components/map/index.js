import { useState, useEffect, useRef } from 'react';
import T from 'prop-types';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions } from 'ol/interaction';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import MagicWandInteraction from 'ol-magic-wand';

import 'ol/ol.css';

import { osm, vector, mainLayer } from './layers';
import { MapContext } from '../../contexts/MapContext';
import { ProjectLayer } from './ProjectLayer';

export function MapWrapper({ project, children }) {
  const [map, setMap] = useState();

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  useEffect(() => {
    const wand = new MagicWandInteraction({
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
      interactions: defaultInteractions().extend([wand]),
      layers: [osm, mainLayer, vector],
      view: view
    });

    setMap(initialMap);
  }, []);

  return (
    <MapContext.Provider value={{ map }}>
      <div
        ref={mapElement}
        style={{ height: 'calc(100vh - 60px)', width: '100%' }}
      >
        {project && <ProjectLayer project={project} />}
        {children}
      </div>
    </MapContext.Provider>
  );
}

MapWrapper.propTypes = {
  project: T.object,
  children: T.node
};

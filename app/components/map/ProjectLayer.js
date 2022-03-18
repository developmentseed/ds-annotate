import { useEffect, useContext } from 'react';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';

import { MapContext } from '../../contexts/MapContext';
import { makeFeatureCollection } from '../../utils/featureCollection';
import { vector, mainLayer, getImageryLayer } from './layers';

const PADDING = { padding: [100, 100, 100, 100] };

export const ProjectLayer = ({ project }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    if (project) {
      const geojsonSource = new VectorSource({
        features: new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(
          makeFeatureCollection(project)
        )
      });
      vector.setSource(geojsonSource);
      map.getView().fit(geojsonSource.getExtent(), PADDING);
    }

    return () => {
      if (map) map.getView().fit([0, 0, 0, 0], PADDING);
    };
  }, [map, project]);

  useEffect(() => {
    if (!map) return;
    if (project && project.properties && project.properties.imagery && map) {
      mainLayer.setSource(getImageryLayer(project.properties.imagery));
    }

    return () => {
      if (map) mainLayer.setSource(null);
    };
  }, [map, project]);

  return null;
};

import { useEffect, useContext } from 'react';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';

import { MapContext } from '../../contexts/MapContext';
import { makeFeatureCollection } from '../../utils/featureCollection';
import {
  vector,
  mainLayer,
  getImageryLayer,
  vectorSegData,
  vectorHighlighted,
} from './layers';

const PADDING = { padding: [100, 100, 100, 100] };

export const ProjectLayer = ({ project, items, highlightedItem }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    if (project) {
      const geojsonSource = new VectorSource({
        features: new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(
          makeFeatureCollection(project)
        ),
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

  useEffect(() => {
    if (!map) return;
    if (items.length >= 0) {
      const segDataSource = new VectorSource({
        features: items,
        wrapX: true,
      });
      vectorSegData.setSource(segDataSource);
    }
  }, [map, items]);

  useEffect(() => {
    if (!map) return;
    const segDataSource = new VectorSource({
      features: highlightedItem ? [highlightedItem] : [],
      wrapX: true,
    });
    vectorHighlighted.setSource(segDataSource);
  }, [map, highlightedItem]);

  return null;
};

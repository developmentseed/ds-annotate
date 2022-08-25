import { useEffect, useContext } from 'react';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { Tile as TileLayer} from 'ol/layer';

import { MapContext } from '../../contexts/MapContext';
import { MagicWandContext } from '../../contexts/MapContext';

import { makeFeatureCollection } from '../../utils/featureCollection';
import {
  vector,
  mainLayer,
  getImagerySourceLayer,
  vectorSegData,
  vectorHighlighted,
  cdl_layers,
} from './layers';

const PADDING = { padding: [100, 100, 100, 100] };

export const ProjectLayer = ({
  project,
  items,
  highlightedItem,
  displayExtraLayers,
}) => {
  const { map } = useContext(MapContext);
  const { wand } = useContext(MagicWandContext);

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
      const imageryLayer = getImagerySourceLayer(project.properties.imagery)
      mainLayer.setSource(imageryLayer);
      // clearMask()
      wand.setLayers([mainLayer]);
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

  // map.on('moveend', function (e) {
  //   map.getLayers().forEach((layer) => {
  //     if (layer && layer.get('name') === 'cdl_2019') {
  //       map.removeLayer(layer);
  //       map.render();
  //     }
  //   });


  //   // const imageryLayer = getImageryLayer(project.properties.imagery)
  //   // mainLayer.setSource(imageryLayer);
  //   // wand.setLayers([mainLayer]);

  // });

  useEffect(() => {
    if (!map && !wand) return;

    if (displayExtraLayers) {
      const layer = cdl_layers();
      map.addLayer(layer);
    } else {
      map.getLayers().forEach((layer) => {
        if (layer && layer.get('name') === 'cdl_2019') {
          map.removeLayer(layer);

          const imageryLayer = getImagerySourceLayer(project.properties.imagery)
          const tileLayer = new TileLayer({source:imageryLayer})
        mainLayer.setSource(imageryLayer);
         map.render();
         map.refresh()

        //  wand.setLayers([tileLayer])
        //  console.log(wand.getLayers())
        //  console.log(wand)
        //  console.log(Object.getOwnPropertyNames(wand));
        }
      });

        // const imageryLayer = getImageryLayer(project.properties.imagery)
        // mainLayer.setSource(imageryLayer);
        // clearMask()
        // wand.clear()
        // wand.setLayers([mainLayer]);
        // wand.clear()
        // wand.clearMask()
    }
  }, [displayExtraLayers]);
  return null;
};

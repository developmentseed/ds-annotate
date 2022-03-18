import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { TileWMS, OSM, XYZ } from 'ol/source';
import { Stroke, Style } from 'ol/style';

export const osm = new TileLayer({
  source: new OSM(),
  zIndex: 1
});

export const vector = new VectorLayer({
  style: new Style({
    stroke: new Stroke({
      color: '#dd1c77',
      width: 2
    })
  }),
  zIndex: 5
});

export const mainLayer = new TileLayer({ zIndex: 2 });

export const getImageryLayer = (imagery) => {
  if (imagery.type === 'wms') {
    return new TileWMS({
      url: imagery.url,
      params: { LAYERS: imagery.layerName, TILED: true },
      ratio: 1,
      serverType: imagery.serverType,
      crossOrigin: 'anonymous'
    });
  }

  if (imagery.type === 'tms') {
    return new XYZ({ url: imagery.url });
  }
};

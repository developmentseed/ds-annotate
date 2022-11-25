import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { TileWMS, OSM, XYZ } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import MultiPoint from "ol/geom/MultiPoint";

export const osm = new TileLayer({
  source: new OSM(),
  zIndex: 1,
});

export const vector = new VectorLayer({
  style: new Style({
    stroke: new Stroke({
      color: "#dd1c77",
      width: 2,
    }),
  }),
  zIndex: 5,
});

export const vectorSegData = new VectorLayer({
  style: function (feature) {
    return [
      new Style({
        background: "white",
        stroke: new Stroke({
          color: feature.get("color"),
          // lineDash: [2],
          width: 2,
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({
            color: feature.get("color"),
          }),
        }),
        geometry: function (feature) {
          // return the coordinates of the first ring of the polygon
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
    ];
  },
  zIndex: 5,
});

export const vectorHighlighted = new VectorLayer({
  style: new Style({
    stroke: new Stroke({
      width: 3,
      color: [209, 51, 255, 1],
    }),
    fill: new Fill({
      color: [209, 51, 255, 0.3],
    }),
  }),
  zIndex: 5,
});

export const mainLayer = new TileLayer({ zIndex: 2 });

export const getImageryLayer = (imagery) => {
  if (imagery.type === "wms") {
    return new TileWMS({
      url: imagery.url,
      params: { LAYERS: imagery.layerName, TILED: true },
      ratio: 1,
      serverType: imagery.serverType,
      crossOrigin: "anonymous",
    });
  }

  if (imagery.type === "tms") {
    return new XYZ({ url: imagery.url, crossOrigin: "anonymous" });
  }
};

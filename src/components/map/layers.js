import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { TileWMS, OSM, XYZ } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import foregroundIcon from './../../media/icons/foreground.svg';
import backgroundIcon from './../../media/icons/background.svg';

import MultiPoint from "ol/geom/MultiPoint";
import { convertColorToRGBA } from "../../utils/utils";
export const osm = new TileLayer({
  source: new OSM(),
  zIndex: 1,
});

export const vector = new VectorLayer({
  style: new Style({
    stroke: new Stroke({
      color: "#dd1c77",
      width: 3,
    }),
  }),
  zIndex: 5,
});

export const vectorSegData = new VectorLayer({
  style: function (feature) {
    const colorCode = feature.get("color");
    const transparency = 0.1;
    return [
      new Style({
        background: "white",
        stroke: new Stroke({
          color: colorCode,
          width: 1,
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 1.2,
          fill: new Fill({
            color: colorCode,
          }),
        }),
        geometry: function (feature) {
          // Return the coordinates of the first ring of the polygon
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
      new Style({
        fill: new Fill({
          color: convertColorToRGBA(colorCode, transparency),
        }),
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

export const mainLayer = new TileLayer({ zIndex: 2, title: "main_layer" });

export const getImageryLayer = (imagery) => {
  if (imagery.type === "wms") {
    return new TileWMS({
      url: imagery.url,
      // params: { LAYERS: imagery.layerName, TILED: true },
      params: imagery.params,
      ratio: 1,
      serverType: imagery.serverType,
      crossOrigin: "anonymous",
    });
  }

  if (imagery.type === "tms") {
    return new XYZ({ url: imagery.url, crossOrigin: "anonymous" });
  }
};

export const vectorPointSelector = new VectorLayer({
  source: new VectorSource(),
  style: function (feature) {
    const iconUrl = feature.get("label") === 1 ? foregroundIcon : backgroundIcon;
    const defaultScale = 2; 
    const scale = feature.get("size") ? feature.get("size") : defaultScale; 
    return new Style({
      image: new Icon({
        src: iconUrl,
        scale: scale,
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
      }),
    });
  },
  zIndex: 10,
});

export const encodeMapViews = new VectorLayer({
  style: new Style({
    stroke: new Stroke({
      width: 2,
      color: [219, 154, 109, 1],
    }),
  }),
  zIndex: 7,
});

export const encodeMapViewHighlighted = new VectorLayer({
  style: new Style({
    stroke: new Stroke({
      width: 2,
      color: [0, 255, 97, 1],
    }),
  }),
  zIndex: 8,
});

import 'ol/ol.css';
import './style.css';

import { Map, View } from 'ol';
import {
  Image as ImageLayer,
  Tile as TileLayer,
  Vector as VectorLayer,
} from 'ol/layer';
import { ImageWMS, OSM, Vector as VectorSource } from 'ol/source';
import MagicWandInteraction from 'ol-magic-wand';
import { defaults as defaultInteractions } from 'ol/interaction';
import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import {fromLonLat} from 'ol/proj';


export const Map = () => {
  return <div id="map" />
}

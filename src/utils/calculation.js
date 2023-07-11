import * as turf from "@turf/turf";
import { bbox as bboxExtent } from "ol/extent";
import View from "ol/View";
import { fromLonLat } from "ol/proj";

import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import { olFeatures2geojson } from "./convert";

export function lngLatToPixel(flatCoordinates, bbox, image_shape) {
  // Extract the bounding box coordinates
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const [mapWidth, mapHeight] = image_shape;
  const [lng, lat] = flatCoordinates;
  // Calculate the percentage of the point's position in the bounding box
  const xFactor = (lng - minLng) / (maxLng - minLng);
  const yFactor = (lat - minLat) / (maxLat - minLat);

  // Convert the percentage to pixel position
  const x = xFactor * mapWidth;
  const y = (1 - yFactor) * mapHeight; // We subtract from 1 because pixel coordinate system starts from top

  return { x, y };
}

/**
 * Check Clicked point falls into the bbox og the encode cached images
 * @param {*} map
 * @param {*} pointsSelector
 * @returns objects of properties for decode request
 */
export const pointIsInEncodeBbox = (encodeItem, pointsSelector) => {
  // select the first point
  const pointFeature = pointsSelector[0];
  const geometry = pointFeature.getGeometry();
  const flatCoordinates = geometry.getFlatCoordinates();

  //point
  const pt = turf.point(flatCoordinates);
  // polygon
  const { bbox, image_shape } = encodeItem;
  let polygonCoords = [
    [
      [bbox[0], bbox[1]],
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
    ],
  ];

  const poly = turf.polygon(polygonCoords);

  const isPointInPolygon = turf.booleanPointInPolygon(pt, poly);

  const pixels = lngLatToPixel(flatCoordinates, bbox, image_shape);

  console.log(pixels);
  return isPointInPolygon;
};

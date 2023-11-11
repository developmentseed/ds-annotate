import * as turf from "@turf/turf";

export function lngLatToPixel(flatCoordinates, bbox, image_shape) {
  // Extract the bounding box coordinates
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const [mapHeight, mapWidth] = image_shape;
  const [lng, lat] = flatCoordinates;
  // Calculate the percentage of the point's position in the bounding box
  const xFactor = (lng - minLng) / (maxLng - minLng);
  const yFactor = (lat - minLat) / (maxLat - minLat);
  // Convert the percentage to pixel position
  const x = xFactor * mapWidth;
  const y = (1 - yFactor) * mapHeight;
  return {
    y: Math.round(y),
    x: Math.round(x),
  };
}

/**
 * Check Clicked point falls into the bbox og the encode cached images
 * @param {*} map
 * @param {*} pointsSelector
 * @returns objects of properties for decode request
 */
export const pointIsInEncodeBbox = (encodeItem, pointSelector) => {
  // select the first point
  const pointFeature = pointSelector;
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
  let pixels = {};
  if (isPointInPolygon) {
    pixels = lngLatToPixel(flatCoordinates, bbox, image_shape);
  }
  return pixels;
};

export const pointsIsInEncodeBbox = (encodeItem, pointsSelector) => {
  const listPixels = pointsSelector.map(function (pointSelector) {
    const pixel = pointIsInEncodeBbox(encodeItem, pointSelector);
    if (Object.keys(pixel).length > 0) {
      return [pixel.x, pixel.y];
    }
  });
  return listPixels;
};

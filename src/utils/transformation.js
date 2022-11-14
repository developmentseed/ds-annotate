import * as turf from "@turf/turf";
import { geojson2olFeatures, olFeatures2geojson } from "./featureCollection";

/**
 * Simplify multipolygon, to do that, We get the area from the out polygon area and
 * inner polygon, if the inere polygon is less than 20% of area of our polygon,
 * it should be removed from the multipolygon.
 * @param {*} features
 * @returns
 */
export const simplifyMultipolygon = (features) => {
  let new_features = [];
  for (let index = 0; index < features.length; index++) {
    const feature = features[index];
    let global_area = turf.area(feature);
    let coordinates = feature.geometry.coordinates;
    let new_coords = [];
    for (let j = 0; j < coordinates.length; j++) {
      const coord = coordinates[j];
      let area = turf.area(turf.polygon([coord]));
      if (area > global_area * 0.2) {
        new_coords.push(coord);
      }
    }
    feature.geometry.coordinates = new_coords;
    new_features.push(feature);
  }
  return new_features;
};

/**
 * Smooth features
 * @param {*} features
 * @returns
 */
export const smooth = (features) => {
  let smoothed = turf.polygonSmooth(turf.featureCollection(features), {
    iterations: 2,
  });
  return smoothed.features;
};

/**
 * Simplify features according to tolerance
 * @param {Array} features
 * @param {number} tolerance
 * @returns
 */
export const simplify = (features, tolerance) => {
  let options = { tolerance: tolerance, highQuality: true };
  let simplified = turf.simplify(turf.featureCollection(features), options);
  return simplified.features;
};

/**
 * Simplify OpenLayer Feature
 * @param {*} olFeature
 * @returns
 */
export const simplifyFeature = (olFeature) => {
  const feature = olFeatures2geojson([olFeature]).features[0];
  // let geojsonFeature = simplify(smooth(simplifyMultipolygon([feature])), 0.00001)[0];
  let geojsonFeature = simplifyMultipolygon([feature])[0];
  // new_features.map((f) => (f.properties.color = '#0000FF'));
  geojsonFeature.properties = feature.properties;
  const newOLFeature = geojson2olFeatures(geojsonFeature)[0];
  return newOLFeature;
};

/**
 * Merge polygons
 * @param {Object} Geojson features
 * @returns
 */
export const unionPolygons = (features) => {
  let result = null;
  let props = {};
  features.forEach(function (feature) {
    if (!result) {
      result = feature;
      props = feature.properties;
    } else {
      result = turf.union(result, feature);
    }
  });
  let new_features = [];
  if (result && result.geometry && result.geometry.type === "MultiPolygon") {
    new_features = result.geometry.coordinates.map((c, index) => {
      return turf.polygon(c, { ...props, id: index + 1 });
    });
  } else if (result && result.geometry && result.geometry.type === "Polygon") {
    result.properties = props;
    new_features = [result];
  } else {
    new_features = features;
  }
  return new_features;
};

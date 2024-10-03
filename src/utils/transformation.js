import * as turf from "@turf/turf";
import { geojson2olFeatures, olFeatures2geojson } from "./convert";
import { guid } from "./utils";

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
      if (coord.length >= 4) {
        let area = turf.area(turf.polygon([coord]));
        if (area > global_area * 0.2) {
          new_coords.push(coord);
        }
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
  const newFeatures = smoothed.features.map((fea, index) => {
    const id = `${guid()}_${index}`;
    fea.id = id;
    fea.properties.id = id;
    return fea;
  });
  return newFeatures;
};

/**
 * Simplify features according to tolerance
 * @param {Array} features
 * @param {number} tolerance
 * @returns
 */
export const simplifyFeatures = (features, tolerance) => {
  let options = { tolerance: tolerance, highQuality: true };
  let simplified = turf.simplify(turf.featureCollection(features), options);
  return simplified.features;
};

/**
 * Simplify a OpenLayer Feature
 * @param {*} olFeature
 * @returns
 */
export const simplifyOlFeature = (olFeature, tolerance) => {
  const feature = olFeatures2geojson([olFeature]).features[0];
  let geojsonFeature = simplifyFeatures(
    // smooth(simplifyMultipolygon([feature])),
    simplifyMultipolygon([feature]),
    tolerance
  )[0];
  // let geojsonFeature = simplifyMultipolygon([feature])[0];
  // new_features.map((f) => (f.properties.color = '#0000FF'));
  geojsonFeature.properties = feature.properties;
  const newOLFeature = geojson2olFeatures(geojsonFeature)[0];
  return newOLFeature;
};

/**
 * Merge polygon by class
 * @param {Object} Geojson features
 */

export const mergePolygonClass = (features) => {
  const grouped = features.reduce((result, current) => {
    const category = current.properties.class;

    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(current);
    return result;
  }, {});

  let results = [];
  for (const class_ in grouped) {
    results = results.concat(unionPolygons(grouped[class_]));
  }
  return results;
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
    new_features = result.geometry.coordinates.map((coords, index) => {
      const newId = `${guid()}_${index}`;
      const singlePolygon = turf.polygon(coords, { ...props, id: newId });
      singlePolygon.id = newId;
      return singlePolygon;
    });
  } else if (result && result.geometry && result.geometry.type === "Polygon") {
    result.properties = props;
    result.id = props.id;
    new_features = [result];
  } else {
    new_features = features;
  }
  return new_features;
};

import GeoJSON from 'ol/format/GeoJSON';
import * as turf from '@turf/turf';
import { feature2geojson, geojson2feature } from './featureCollection';

export const getPoly = (features) => {
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

export const smooth = (features) => {
  let smoothed = turf.polygonSmooth(turf.featureCollection(features), {
    iterations: 2,
  });
  return smoothed.features;
};

export const simplify = (features, tolerance) => {
  let options = { tolerance: tolerance, highQuality: true };
  let simplified = turf.simplify(turf.featureCollection(features), options);
  return simplified.features;
};

export const simplifyFeature = (olFeature) => {
  const feature = feature2geojson(olFeature);
  // let geojsonFeature = simplify(smooth(getPoly([feature])), 0.00001)[0];
  let geojsonFeature = getPoly([feature])[0];
  // new_features.map((f) => (f.properties.color = '#0000FF'));
  geojsonFeature.properties = feature.properties;
  const newOLFeature = geojson2feature(geojsonFeature)[0];
  return newOLFeature;
};

export const union_polygons = (features) => {
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
  if (result.geometry.type === 'MultiPolygon') {
    new_features = result.geometry.coordinates.map((c, index) => {
      return turf.polygon(c, { ...props, id: index + 1 });
    });
  }
  return new_features;
};

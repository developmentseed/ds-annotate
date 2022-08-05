import GeoJSON from 'ol/format/GeoJSON';
import * as turf from '@turf/turf';

export const feature2geojson = (feature) => {
  var geoJsonStr = new GeoJSON().writeFeatures([feature], {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
  const geojsonObj = JSON.parse(geoJsonStr);
  return geojsonObj.features[0];
};

export const geojson2feature = (geojsonFeature) => {
  const fc = turf.featureCollection([geojsonFeature]);
  const features = new GeoJSON().readFeatures(fc, {
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326',
  });
  return features;
};

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

export const simplifyFeatures = (obj_feature) => {
  const feature = feature2geojson(obj_feature);
  let new_features = getPoly([feature]);
  new_features = simplify(smooth(new_features), 0.00001);
  new_features.map((f) => (f.properties.color = '#0000FF'));
  const features_simplified = geojson2feature(new_features[0]);
  return [obj_feature, features_simplified[0]];
};

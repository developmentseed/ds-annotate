import GeoJSON from 'ol/format/geojson';
import simplify from '@turf/simplify';
import { featureCollection } from '@turf/helpers';

export const feature2geojson = (feature) => {
  var geoJsonStr = new GeoJSON().writeFeatures([feature], {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  const geojsonObj = JSON.parse(geoJsonStr);
  return geojsonObj.features[0];
};

export const geojson2feature = (geojsonFeature) => {
  const fc = featureCollection([geojsonFeature]);
  const features = new GeoJSON().readFeatures(fc, {
    featureProjection: 'EPSG:4326',
    dataProjection: 'EPSG:3857'
  });
  return features;
};

export const simplifyGeo = (feature) => {
  const geojson = feature2geojson(feature);
  const options = { tolerance: 0.01, highQuality: false };
  const simplified = simplify(geojson, options);
  const features_simplified = geojson2feature(simplified);
  return [feature, features_simplified[0]];
};

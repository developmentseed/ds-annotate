import GeoJSON from 'ol/format/GeoJSON';
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
  console.log(geojson)
  const options = { tolerance: 0.00001, highQuality: true };
  const simplified = simplify(geojson, options);
  console.log(simplified)
  simplified.properties.color = "#00f"
  const features_simplified = geojson2feature(simplified);
  return [feature, features_simplified[0]];
};

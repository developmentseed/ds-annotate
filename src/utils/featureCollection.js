import GeoJSON from 'ol/format/GeoJSON';
import * as turf from '@turf/turf';

export const makeFeatureCollection = (feature) => {
  return {
    type: 'FeatureCollection',
    features: [feature]
  };
};

export const feature2geojson = (oLFeature) => {
  var geoJsonStr = new GeoJSON().writeFeatures([oLFeature], {
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

export const getGeojson = (vectorSegData) => {
  var geojson = new GeoJSON().writeFeatures(
    vectorSegData,
    {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }
  );
  return JSON.parse(geojson);
};


export const getItems = (geojsonFeatures) => {
  const fc = turf.featureCollection(geojsonFeatures);
  console.log(fc)
  const features = new GeoJSON().readFeatures(fc, {
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326',
  });
  return features;
};

export const getClassLayers =(project)=>{
  return Object.entries(
    project && project.properties
      ? project.properties.classes
      : {}
  ).map((e) => ({
    name: e[0],
    color: e[1],
  }));
}
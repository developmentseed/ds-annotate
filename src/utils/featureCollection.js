import GeoJSON from 'ol/format/geojson';

export const makeFeatureCollection = (feature) => {
  return {
    type: 'FeatureCollection',
    features: [feature]
  };
};

export const getGeojson = (vectorSegData) => {
  var geojson = new GeoJSON().writeFeatures(
    vectorSegData.getSource().getFeatures(),
    {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }
  );
  return geojson;
};

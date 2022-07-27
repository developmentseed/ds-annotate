import GeoJSON from 'ol/format/GeoJSON';

export const makeFeatureCollection = (feature) => {
  return {
    type: 'FeatureCollection',
    features: [feature]
  };
};

export const getGeojson = (vectorSegData) => {
  var geojson = new GeoJSON().writeFeatures(
    vectorSegData,
    {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }
  );
  return geojson;
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
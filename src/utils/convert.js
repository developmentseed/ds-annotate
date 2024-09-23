import GeoJSON from "ol/format/GeoJSON";
import * as turf from "@turf/turf";
// import { proj } from 'ol/proj';
import { transformExtent } from 'ol/proj';



/**
 *
 * @param {Array} geojsonFeature
 * @returns {Array} Array of openLayer features
 */
export const geojson2olFeatures = (geojsonFeature) => {
  const fc = turf.featureCollection([geojsonFeature]);
  const oLFeatures = new GeoJSON().readFeatures(fc, {
    featureProjection: "EPSG:3857",
    dataProjection: "EPSG:4326",
  });
  return oLFeatures;
};

export const getOLFeatures = (features) => {
  const fc = turf.featureCollection(features);
  const oLFeatures = new GeoJSON().readFeatures(fc);
  return oLFeatures;
};

/**
 * Convert list of features to OpenLayers features
 * @param {Array} array of feature
 * @returns {Array} Array of openLayer features
 */
export const features2olFeatures = (features) => {
  const fc = turf.featureCollection(features);
  const oLFeatures = new GeoJSON().readFeatures(fc, {
    featureProjection: "EPSG:3857",
    dataProjection: "EPSG:4326",
  });
  return oLFeatures;
};

/**
 *
 * @param {Array[olFeatures]} olFeatures
 * @returns {List} list of features
 */
export const olFeatures2Features = (olFeatures) => {
  var geojson = new GeoJSON().writeFeatures(olFeatures, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
    properties: ["px", "py"],
  });
  return JSON.parse(geojson).features;
};

/**
 *
 * @param {Array[olFeatures]} olFeatures
 * @returns {Object} GeoJson object
 */
export const olFeatures2geojson = (olFeatures) => {
  var geojson = new GeoJSON().writeFeatures(olFeatures, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
    properties: ["px", "py"],
  });
  return JSON.parse(geojson);
};



export const convertBbox3857to4326 = (bbox) => {
  const convertedBbox = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
  return convertedBbox;
};


/**
 *
 * @param {Object} feature of project
 * @returns {Array} List of objects of classes
 */
export const getClassLayers = (project) => {
  return Object.entries(
    project && project.properties ? project.properties.classes : {}
  ).map((e) => ({
    name: e[0],
    color: e[1],
  }));
};

/**
 *
 * @param {Object} feature of project
 * @returns {Array} List of objects of classes
 */
export const sam2Geojson = (ListGeoms, activeProject, activeClass, id) => {
  let scores = [];
  const features = [];
  for (let index = 0; index < ListGeoms.length; index++) {
    const strGeom = ListGeoms[index];
    const geom = JSON.parse(strGeom);
    const properties = {
      class: activeClass.name,
      color: activeClass.color,
      project: activeProject.properties.name,
      ...geom.properties,
      id: id,
    };
    scores = geom.properties.confidence_scores;
    const feature = turf.multiPolygon(geom.coordinates, properties);
    features.push(feature);
  }
  const maxNumber = Math.max(...scores);
  const maxIndex = scores.indexOf(maxNumber);
  const maxScoreFeature = features[maxIndex];
  return [maxScoreFeature];
  // return features
};

export const setProps2Features = (features, activeProject, activeClass, id) => {
  const properties = {
    class: activeClass.name,
    color: activeClass.color,
    project: activeProject.properties.name,
  };

  return features.map((feature, index) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        id: `${index}_${feature.properties.value}`,
        ...properties,
      },
    };
  });
};


export const bbox2polygon = (bbox) => {
  const poly = turf.bboxPolygon(bbox);
  return poly;
};



export const saveFeaturesToGeoJSONFile = (features) => {
  const geoJSON = {
    type: "FeatureCollection",
    features: features,
  };

  const geoJSONString = JSON.stringify(geoJSON, null, 2);

  const blob = new Blob([geoJSONString], { type: "application/geo+json" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `results.geojson`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
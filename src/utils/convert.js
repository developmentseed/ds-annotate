import GeoJSON from "ol/format/GeoJSON";
import * as turf from "@turf/turf";

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

export const bbox2polygon = (bbox) => {
  const poly = turf.bboxPolygon(bbox);
  return poly;
};

import GeoJSON from "ol/format/GeoJSON";
import * as turf from "@turf/turf";
import { guid } from "../utils/utils";

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
export const sam2Geojson = (ListGeoms, activeProject, activeClass) => {
  let scores = [];
  const features = [];
  for (let index = 0; index < ListGeoms.length; index++) {
    const strGeom = ListGeoms[index];
    const geom = JSON.parse(strGeom);
    const id = guid();
    const properties = {
      class: activeClass.name,
      color: activeClass.color,
      project: activeProject.properties.name,
      ...geom.properties,
      id,
    };
    scores = geom.properties.confidence_scores;
    const feature = turf.multiPolygon(geom.coordinates, properties);
    features.push(feature);
  }

  const groupFeatures = splitArrayInGroups(features, 4);
  const groupScores = splitArrayInGroups(scores, 4);
  const maxScoreFeatures = [];
  for (let index = 0; index < groupFeatures.length; index++) {
    const predFeatures = groupFeatures[index];
    const predScores = groupScores[index];
    const maxNumber = Math.max(...predScores);
    const maxIndex = predScores.indexOf(maxNumber);
    const maxScoreFeature = predFeatures[maxIndex];
    maxScoreFeatures.push(maxScoreFeature);
  }
  return maxScoreFeatures;
};

/**
 *
 * @param {Array} Bounding box [minX, minY, maxX, maxY]
 * @returns {Object} polygon object
 */
export const bbox2polygon = (bbox) => {
  const poly = turf.bboxPolygon(bbox);
  return poly;
};

/**
 *
 * @param {Array} Any type of list
 * @param {int} size of the items to include in the group
 * @returns
 */
export const splitArrayInGroups = (arr, groupSize) => {
  return Array.from({ length: Math.ceil(arr.length / groupSize) }, (_, i) =>
    arr.slice(i * groupSize, (i + 1) * groupSize)
  );
};

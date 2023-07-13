import * as turf from "@turf/turf";
import { NotificationManager } from "react-notifications";
import apis from "./../static/apis.json";

/**
 * Download file
 * @param {object} data
 * @param {string} fileName
 */
export const downloadGeojsonFile = (data, fileName) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  const blob = new Blob([data], { type: "octet/stream" });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Upload data to s3
 * @param {object} data
 * @param {string} fileName
 * @returns Url of the uploaded file
 */
export const uploadtoS3 = async (data, filename) => {
  const url = `${apis.geojsonAPI}/ds_annotate/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        crossOrigin: "anonymous",
      },
      body: JSON.stringify({ data, filename }),
    });

    if (response.ok) {
      return response.json();
    } else {
      console.log("%cutils.js line:44 response", "color: #007acc;", response);
      throw new Error("Request failed with status " + response.status);
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const downloadInJOSM = (data, project) => {
  fetch("https://bfokggy4ac.execute-api.us-east-1.amazonaws.com/ds_annotate/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      crossOrigin: "anonymous",
    },
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("%cutils.js line:67 data", "color: #007acc;", data);
      const { url, type } = project.properties.imagery;
      const layer_name = project.properties.name.replace(/ /g, "_");
      const url_geojson = `http://localhost:8111/import?url=${data.url.replace(
        "https",
        "http"
      )}`;
      fetch(url_geojson);
      const url_layer = `​http://localhost:8111/imagery?title=${layer_name}&type=${type}&url=${url}`;
      fetch(url_layer);
    });
};

export const getProjectTemplate = (searchParams) => {
  // Set project from Query
  const classes_items = searchParams.get("classes");
  const name = searchParams.get("name");
  const imagery_type = searchParams.get("imagery_type");
  const imagery_url = searchParams.get("imagery_url");
  let project_bbox = searchParams.get("project_bbox");
  let project_geometry = searchParams.get("project_geometry");
  let projectFeature = null;
  if (
    classes_items &&
    name &&
    imagery_type &&
    imagery_url &&
    (project_bbox || project_geometry)
  ) {
    if (project_bbox) {
      project_bbox = project_bbox.split(",").map((i) => Number(i));
      projectFeature = turf.bboxPolygon(project_bbox);
    } else if (project_geometry) {
      projectFeature = turf.polygon(JSON.parse(project_geometry));
    }
    projectFeature.properties.slug = name;
    projectFeature.properties.name = name;
    projectFeature.properties.classes = {};
    classes_items.split("|").forEach((item) => {
      const tuple = item.split(",");
      projectFeature.properties.classes[tuple[0]] = `#${tuple[1]}`;
    });

    projectFeature.properties.imagery = {
      type: imagery_type,
      url: imagery_url,
    };
  }
  return projectFeature;
};

/**
 *
 * @param {array} items of OpenLayer
 * @param {object} activeClass
 * @returns max item id plus 1
 */
export const getMaxIdPerClass = (items, activeClass) => {
  const items_ = items.map((i) => i.values_);
  // if (items_.length === 0) return 1;
  // const filteredItems = items_.filter((obj) => obj.class === activeClass.name);
  // if (filteredItems.length === 0) return 1;
  // const maxItem = filteredItems.reduce((max, current) =>
  //   max.id > current.id ? max : current
  // );
  return items_.length + 1;
};

/**
 * convert color code to RGBA
 * @param {string} colorCode
 * @param {float} opacity
 * @returns
 */
export const convertColorToRGBA = (colorCode, opacity) => {
  colorCode = colorCode.replace("#", "");
  const red = parseInt(colorCode.substring(0, 2), 16);
  const green = parseInt(colorCode.substring(2, 4), 16);
  const blue = parseInt(colorCode.substring(4, 6), 16);
  const rgba = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  return rgba;
};

/**
 *
 * @returns Strign of 4 characters
 */
export const guid = () => {
  var w = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return `${w().substring(0, 4)}`;
};

/**
 * replace empty space with _
 * @param {String} name
 * @returns
 */
export const simplyName = (name) => {
  return name.replace(/\s/g, "_");
};

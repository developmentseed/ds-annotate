import * as turf from "@turf/turf";

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

export const getProjectTemplate = (searchParams) => {
  // Set project from Query
  const classes_items = searchParams.get("classes");
  const project = searchParams.get("project");
  const imagery_type = searchParams.get("imagery_type");
  const imagery_url = searchParams.get("imagery_url");
  let project_bbox = searchParams.get("project_bbox");
  let project_geometry = searchParams.get("project_geometry");
  let projectFeature = null;
  if (
    classes_items &&
    project &&
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
    projectFeature.properties.slug = project;
    projectFeature.properties.name = project;
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

export const getFileNameFromURL = (url) => {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  const filenameWithExtension = pathname.split("/").pop();
  const filename = filenameWithExtension.split(".").slice(0, -1).join(".");
  return filename;
};

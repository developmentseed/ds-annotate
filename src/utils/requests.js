import { gpuEncodeAPI, cpuDecodeAPI } from "../config";
import { NotificationManager } from "react-notifications";
import { olFeatures2geojson } from "./convert";
import { geojsonAPI } from "./../config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  crossOrigin: "anonymous",
};

/**
 *
 * @param {*} map
 * @param {*} pointsSelector
 * @returns objects of properties for decode request
 */
export const getPropertiesRequest = (map, pointsSelector) => {
  const fcPoints = olFeatures2geojson(pointsSelector);
  const coords = fcPoints.features.map((f) => [
    f.properties.px,
    f.properties.py,
  ]);
  const [imgWidth, imgHeight] = map.getSize();
  // Get the view CRS and extent
  const view = map.getView();
  const zoom = view.getZoom();
  const projection = view.getProjection();
  const crs = projection.getCode();
  const bbox = view.calculateExtent(map.getSize());
  const reqProps = {
    image_shape: [imgHeight, imgWidth],
    input_label: 1,
    input_point: coords[0],
    crs,
    bbox,
    zoom,
  };
  return reqProps;
};

/**
 * Request encode API
 * @param {*} base64_string
 * @returns
 */
export const getEncode = async (base64_string) => {
  const encodeURL = `${gpuEncodeAPI}/predictions/sam_vit_h_encode`;
  try {
    // Encode
    const encodeResponse = await fetch(encodeURL, {
      method: "POST",
      headers,
      body: JSON.stringify({ encoded_image: base64_string }),
    });
    if (!encodeResponse.ok) {
      NotificationManager.error(
        `${encodeURL}`,
        `Encode server error ${encodeResponse.status}`,
        30000
      );
      throw new Error(`Error: ${encodeResponse.status}`);
    }
    const encodeRespJson = await encodeResponse.json();
    return encodeRespJson;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Request decode API
 * @param {*} decodePayload
 * @returns
 */
export const getDecode = async (decodePayload) => {
  const decodeURL = `${cpuDecodeAPI}/predictions/sam_vit_h_decode`;
  try {
    // Decode
    const decodeResponse = await fetch(decodeURL, {
      method: "POST",
      headers,
      body: JSON.stringify(decodePayload),
    });
    if (!decodeResponse.ok) {
      NotificationManager.error(
        `${decodeURL} `,
        `Decode server error ${decodeResponse.status}`,
        30000
      );
      throw new Error(`Error: ${decodeResponse.status}`);
    }
    const decodeRespJson = await decodeResponse.json();
    return decodeRespJson;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @param {list} urls
 * @returns list of response json
 */
export const fetchListURLS = async (urls) => {
  const fetchPromises = urls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return undefined;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data from URL: ", url, " Error: ", error);
      return undefined;
    }
  });

  let results = await Promise.all(fetchPromises);
  results = results.filter((r) => r !== undefined);
  return results;
};

/**
 * Upload data to s3
 * @param {object} data
 * @param {string} fileName
 * @returns Url of the uploaded file
 */
export const uploadtoS3 = async (data, filename) => {
  const url = `${geojsonAPI}/ds_annotate/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
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

/**
 * Download data in JOSM
 * @param {*} data
 * @param {*} project
 */
export const downloadInJOSM = (data, project) => {
  fetch(`${geojsonAPI}/ds_annotate/`, {
    method: "POST",
    headers,
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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

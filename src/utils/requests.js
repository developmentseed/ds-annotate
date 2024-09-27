import { gpuEncodeAPI, cpuDecodeAPI } from "../config";
import { NotificationManager } from "react-notifications";
import { olFeatures2geojson } from "./convert";
import { geojsonAPI } from "./../config";
import { convertBbox3857to4326 } from "./convert";
import { guid } from "./utils";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
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
// export const getEncode = async (base64_string) => {
//   const encodeURL = `${gpuEncodeAPI}/predictions/sam_vit_h_encode`;
//   try {
//     // Encode
//     const encodeResponse = await fetch(encodeURL, {
//       method: "POST",
//       headers,
//       body: JSON.stringify({ encoded_image: base64_string }),
//     });
//     if (!encodeResponse.ok) {
//       NotificationManager.error(
//         `${encodeURL}`,
//         `Encode server error ${encodeResponse.status}`,
//         10000
//       );
//       throw new Error(`Error: ${encodeResponse.status}`);
//     }
//     const encodeRespJson = await encodeResponse.json();
//     return encodeRespJson;
//   } catch (error) {
//     console.log(error);
//   }
// };
export const getRequest = async (url) => {
  const reqUrl = `${cpuDecodeAPI}/${url}`;
  try {
    const response = await fetch(reqUrl);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return null;
  }
};

// SAM2
export const setAOI = async (encodeItem) => {
  const url = `${cpuDecodeAPI}/aoi`;
  console.log(url);
  try {
    const reqProps = {
      canvas_image: encodeItem.canvas,
      bbox: convertBbox3857to4326(encodeItem.bbox),
      zoom: encodeItem.zoom,
      crs: "EPSG:4326",
      id: encodeItem.id,
      project: encodeItem.project,
    };
    const encodeResponse = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(reqProps),
    });
    if (!encodeResponse.ok) {
      NotificationManager.error(
        `${url}`,
        `Encode server error ${encodeResponse.status}`,
        10000
      );
      throw new Error(`Error: ${encodeResponse.status}`);
    }
    const encodeRespJson = await encodeResponse.json();
    return encodeRespJson;
  } catch (error) {
    console.log(error);
  }
};

// SAM2
export const requestSegments = async (payload, url_path) => {
  const apiUrl = `${cpuDecodeAPI}/${url_path}`;
  console.log(payload);
  try {
    // Decode
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      NotificationManager.error(
        `${apiUrl} `,
        `Decode server error ${resp.status}`,
        10000
      );
      throw new Error(`Error: ${resp.status}`);
    }
    const decodeRespJson = await resp.json();
    return decodeRespJson;
  } catch (error) {
    console.log(error);
  }
};

export const requestEncodeImages = async (project_id) => {
  const apiUrl = `${cpuDecodeAPI}/predictions?project_id=${project_id}`;
  try {
    const resp = await fetch(apiUrl, {
      method: "GET",
      headers,
    });
    const decodeRespJson = await resp.json();
    // TODO, change here  to handle response
    if (decodeRespJson.detail) {
      decodeRespJson.detection = {};
      return decodeRespJson;
    }
    return decodeRespJson;
  } catch (error) {
    console.log(error);
  }
};

export const fetchGeoJSONData = async (propsReq) => {
  const url =
    "https://gist.githubusercontent.com/Rub21/c7001da2925661a4e660fde237e94473/raw/88f6f163029188dd1c8e3c23ff66aaaa8a6bac93/sam2_result.json";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const data = await response.json();
    return { geojson: data };
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
  }
};

export const getDecode = async (payload) => {
  const decodeURL = `${cpuDecodeAPI}/predictions/sam_vit_h_decode`;
  try {
    // Decode
    const decodeResponse = await fetch(decodeURL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!decodeResponse.ok) {
      NotificationManager.error(
        `${decodeURL} `,
        `Decode server error ${decodeResponse.status}`,
        10000
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
export const downloadInJOSM = (data, project, id) => {
  const url = `${cpuDecodeAPI}/upload_geojson`;

  fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ data, project: project.properties.slug, id }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("%csrc/utils/requests.js:272 data", "color: #007acc;", data);
      const { url, type } = project.properties.imagery;
      const layer_name = project.properties.name.replace(/ /g, "_");
      const url_geojson = `http://localhost:8111/import?url=${data.file_url.replace(
        "https",
        "http"
      )}`;
      fetch(url_geojson);
      const url_layer = `​http://localhost:8111/imagery?title=${layer_name}&type=${type}&url=${url}`;
      fetch(url_layer);
    });
};

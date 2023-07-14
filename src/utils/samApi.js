import apis from "./../static/apis.json";
import { NotificationManager } from "react-notifications";
import { olFeatures2geojson } from "./convert";

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
  const encodeURL = `${apis.gpuEncodeAPI}/predictions/sam_vit_h_encode`;
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
  const decodeURL = `${apis.cpuDecodeAPI}/predictions/sam_vit_h_decode`;
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

export const fetchListURLS = async (urls) => {
  try {
    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    });

    const results = await Promise.all(fetchPromises);
    return results;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

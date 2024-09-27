export const gpuEncodeAPI =
  process.env.REACT_APP_ENV === "production"
    ? "https://sas-gpu.ds.io"
    : "https://k8s-encoder.segmentanythingservice.com";
export const SamGeoAPI = "https://samgeo-api.geocompas.ai";

export const geojsonAPI = "none";
export const indexedDBName = "dsAnnotateDB";
export const indexedDBVersion = 1;

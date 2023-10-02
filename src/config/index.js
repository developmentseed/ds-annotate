export const gpuEncodeAPI =
  process.env.REACT_APP_ENV === "production"
    ? "https://sas-gpu.ds.io"
    : "https://k8s-encoder.segmentanythingservice.com";
export const cpuDecodeAPI =
  process.env.REACT_APP_ENV === "production"
    ? "https://sas.ds.io"
    : "https://k8s-decoder.segmentanythingservice.com";
export const geojsonAPI =
  "https://7v5fsac2d6.execute-api.us-east-1.amazonaws.com";
export const indexedDBName = "dsAnnotateDB";
export const indexedDBVersion = 1;

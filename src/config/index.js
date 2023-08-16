export const gpuEncodeAPI =
  process.env.REACT_APP_ENV === "production"
    ? "https://sas-gpu.ds.io"
    : "https://gpu-spot.segmentanythingservice.com";
export const cpuDecodeAPI = "https://sas.ds.io";
export const samAPI =
  "http://segme-gpuel-ekfao79wi98g-617785108.us-east-1.elb.amazonaws.com";
export const geojsonAPI =
  "https://7v5fsac2d6.execute-api.us-east-1.amazonaws.com";
export const indexedDBName = "dsAnnotateDB";
export const indexedDBVersion = 1;

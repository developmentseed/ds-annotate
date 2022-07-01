export const downloadGeojsonFile = (data, fileName) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const downloadInJOSM = (data, project) => {
  fetch('https://api.github.com/gists', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${process.env.GIST_TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      public: true,
      files: {
        ['geojson.geojson']: {
          content: data
        }
      }
    })
  })
    .then((response) => response.json())
    .then((data) => {
      // Set TMS layer
      const { url, type, layerName } = project.properties.imagery;
      const layer_name = project.properties.name.replace(/\s/g, '_');

      const layerName_encode = encodeURIComponent(layerName);
      let query = `?SERVICE=WMS&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=${layerName_encode}&TILED=true&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={bbox}`;
      query = encodeURIComponent(query);
      const url_layer = `​http://127.0.0.1:8111/imagery?title=${layer_name}&type=${type}&url=${url}${query}`;

      fetch(url_layer).then((response) => response);

      const raw_url = data.files['geojson.geojson'].raw_url;
      const url_geojson = `http://127.0.0.1:8111/import?url=${raw_url}`;
      fetch(url_geojson);
    });
};

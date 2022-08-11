import * as turf from '@turf/turf';

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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public: true,
      files: {
        geojson: {
          content: data,
        },
      },
    }),
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

export const getProjectTemplate = (searchParams) => {
  // Set project from Query
  const classes_items = searchParams.get('classes');
  const name = searchParams.get('name');
  const imagery_type = searchParams.get('imagery_type');
  const imagery_url = searchParams.get('imagery_url');
  let project_bbox = searchParams.get('project_bbox');
  let projectFeature = null;
  // console.log(classes_items ,name ,imagery_type ,imagery_url ,project_bbox)
  if (classes_items && name && imagery_type && imagery_url && project_bbox) {

    project_bbox = project_bbox.split(',').map((i) => Number(i));
    projectFeature = turf.bboxPolygon(project_bbox);
    projectFeature.properties.slug = name;
    projectFeature.properties.name = name;
    projectFeature.properties.classes = {};
    classes_items.split('|').forEach((item) => {
      const tuple = item.split(',');
      projectFeature.properties.classes[tuple[0]] = `#${tuple[1]}`;
    });

    projectFeature.properties.imagery = {
      type: imagery_type,
      url: imagery_url,
    };
  }
  return projectFeature;
};

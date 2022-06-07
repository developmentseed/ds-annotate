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

export const downloadInJOSM = (data) => {
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
      const raw_url = data.files['geojson.geojson'].raw_url;
      console.log(raw_url);
      const url = `http://127.0.0.1:8111/import?url=${raw_url}`;
      fetch(url);
    });
};

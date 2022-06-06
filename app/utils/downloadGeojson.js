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
  // Need to pass in env var the token
  const token = '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';
  fetch('https://api.github.com/gists', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
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

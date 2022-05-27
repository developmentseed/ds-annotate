export const downloadGeojsonFile = (data, fileName) => {
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  var json = JSON.stringify(data),
    blob = new Blob([json], { type: 'octet/stream' }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

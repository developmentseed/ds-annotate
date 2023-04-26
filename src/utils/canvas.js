export const getCanvas = (map) => {
  if (!map) return;
  console.log("Fetch canvas..")
  const mapCanvas = document.createElement('canvas');
  const size = map.getSize();
  mapCanvas.width = size[0];
  mapCanvas.height = size[1];
  const mapContext = mapCanvas.getContext('2d');
  Array.prototype.forEach.call(
    map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
    function (canvas) {

      if (canvas.width > 0) {
        const opacity =
          canvas.parentNode.style.opacity || canvas.style.opacity;
        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
        let matrix;
        const transform = canvas.style.transform;
        if (transform) {
          // Get the transform parameters from the style's transform matrix
          matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number);
        } else {
          matrix = [
            parseFloat(canvas.style.width) / canvas.width,
            0,
            0,
            parseFloat(canvas.style.height) / canvas.height,
            0,
            0,
          ];
        }
        // Apply the transform to the export map context
        CanvasRenderingContext2D.prototype.setTransform.apply(
          mapContext,
          matrix
        );
        const backgroundColor = canvas.parentNode.style.backgroundColor;
        if (backgroundColor) {
          mapContext.fillStyle = backgroundColor;
          mapContext.fillRect(0, 0, canvas.width, canvas.height);
        }
        mapContext.drawImage(canvas, 0, 0);
      }
    }
  );
  mapContext.globalAlpha = 1;
  mapContext.setTransform(1, 0, 0, 1, 0, 0);
  const canvas = mapCanvas.toDataURL("image/jpeg", 0.5)
  const base64 = canvas.split(';base64,')[1];
  // console.log(canvas)
  return base64;
};







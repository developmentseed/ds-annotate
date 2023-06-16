import Tile from "ol/layer/Tile";
import Map from "ol/Map";
import cloneDeep from "lodash/cloneDeep";

export const getCanvas = (map) => {
  if (!map) return;
  const mapCanvas = document.createElement("canvas");
  const size = map.getSize();
  mapCanvas.width = size[0];
  mapCanvas.height = size[1];
  const mapContext = mapCanvas.getContext("2d");
  Array.prototype.forEach.call(
    map.getViewport().querySelectorAll(".ol-layer canvas, canvas.ol-layer"),
    function (canvas) {
      if (canvas.width > 0) {
        const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
        mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
        let matrix;
        const transform = canvas.style.transform;
        if (transform) {
          // Get the transform parameters from the style's transform matrix
          matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(",")
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
  const canvas = mapCanvas.toDataURL("image/jpeg", 0.9);
  return canvas;
};

export const getCanvasForLayer = (map, layerTitle) => {
  if (!map) return;
  const size = map.getSize();
  var layerGroup = map.getLayerGroup();
  var myLayer = null;
  layerGroup.getLayers().forEach(function (layer) {
    if (layer && layer.get("title") === layerTitle) {
      myLayer = layer;
    }
  });
  if (myLayer && myLayer instanceof Tile) {
    const div = document.createElement("div");
    div.setAttribute(
      "style",
      `position: absolute; visibility: hidden; height: ${size[1]}px; width: ${size[0]}px; background: #456299;`
    );
    div.setAttribute("id", "map");
    document.body.appendChild(div);
    const clonedMap = new Map({
      target: "map",
      layers: [cloneDeep(myLayer)],
      view: cloneDeep(map.getView()),
    });
    // Set some time to load the map
    return new Promise((resolve) =>
      setTimeout(function () {
        const canvas = getCanvas(clonedMap);
        clonedMap.dispose();
        div.remove();
        resolve(canvas);
      }, 3000)
    );
  }
};

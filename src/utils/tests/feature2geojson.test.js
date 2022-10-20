import { getGeojson } from "../featureCollection";
import { FEATURES_3857 } from "./fixtures";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";

describe("Vectore data to Geojson", () => {
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(FEATURES_3857),
  });
  const geojson = getGeojson(vectorSource.getFeatures());
  test("should return the number of features", () => {
    expect(geojson.features.length).toBe(7);
  });
});

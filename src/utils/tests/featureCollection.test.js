import { olFeatures2geojson, geojson2olFeatures } from "../convert";
import { FEATURES_3857, FEATURES_4326 } from "./fixtures";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";

describe("Convert OpenLayer features to Geojson", () => {
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(FEATURES_3857),
  });
  //EPSG:3857: [-5e6, -1e6] = EPSG:4326: [-44.91576420597607, -8.946573850543416]
  const olCoordinates = vectorSource
    .getFeatures()[0]
    .getGeometry()
    .getCoordinates();
  const geojson = olFeatures2geojson(vectorSource.getFeatures());
  const vCoordinates = geojson.features[0].geometry.coordinates[0][0];
  test("should return coordinates in EPSG:4326", () => {
    expect(olCoordinates[0][0]).toEqual([-5000000, -1000000]);
    expect(vCoordinates).toEqual([-44.91576420597607, -8.946573850543416]);
  });
});

describe("Convert geojson to OpenLayer features", () => {
  const vFeature = FEATURES_4326.features[0];
  const vCoordinates = vFeature.geometry.coordinates[0][0];
  const olFeature = geojson2olFeatures(vFeature)[0];
  const olCoordinates = olFeature.getGeometry().getCoordinates()[0][0];
  test("should return coordinates in EPSG:3857", () => {
    expect(vCoordinates).toEqual([-74.24398520109803, -13.133541195879786]);
    expect(olCoordinates).toEqual([-8264802.627049572, -1474993.15984846]);
  });
});

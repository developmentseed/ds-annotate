import {
  simplifyMultipolygon,
  simplifyOlFeature,
  unionPolygons,
} from "../transformation";
import { geojson2olFeatures } from "../featureCollection";

import { FEATURES_4326 } from "./fixtures";

describe("Merge polygons", () => {
  test("should return 3 mumber of features", () => {
    expect(unionPolygons(FEATURES_4326.features).length).toBe(3);
  });
});

describe("Simplify Multipolygon", () => {
  test("should return 4 mumber of features", () => {
    expect(simplifyMultipolygon(FEATURES_4326.features).length).toBe(4);
  });
});

describe("Simplify Open Layer feature", () => {
  const oLFeature = geojson2olFeatures(FEATURES_4326.features[3])[0];
  const oLFeatureCoords = oLFeature.getGeometry().getCoordinates();
  const newOlFeatureCoords = simplifyOlFeature(oLFeature, 0.00000001)
    .getGeometry()
    .getCoordinates();
  test("should return Openlayer feature-coordinates greater than  then simplified OL feature", () => {
    expect(oLFeatureCoords[0].length).toEqual(newOlFeatureCoords[0].length);
  });
});

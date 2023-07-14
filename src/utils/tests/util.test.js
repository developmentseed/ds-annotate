import { getProjectTemplate } from "../utils";
describe("Check query params", () => {
  const url_ =
    "http://localhost:3000/ds-annotate?classes=farm,00FFFF|tree,FF00FF&project=Farms-mapping&imagery_type=tms&imagery_url=https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}?blankTile=false&project_bbox=-90.319317,38.482965,-90.247220,38.507418";
  let url = new URL(url_);
  let params = new URLSearchParams(url.search);
  const projectFeature = getProjectTemplate(params);

  test(`Should return project=${params.get("project")}`, () => {
    expect(projectFeature.properties.name).toBe(params.get("project"));
  });

  test(`Should return bbox=${params.get("project_bbox")}`, () => {
    expect(projectFeature.bbox).toEqual([
      -90.319317, 38.482965, -90.24722, 38.507418,
    ]);
  });

  test("Should return properties", () => {
    expect(projectFeature.properties).toEqual({
      slug: "Farms-mapping",
      name: "Farms-mapping",
      classes: { farm: "#00FFFF", tree: "#FF00FF" },
      imagery: {
        type: "tms",
        url: "https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}?blankTile=false",
      },
    });
  });
});

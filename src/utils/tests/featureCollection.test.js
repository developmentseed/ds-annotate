import { getGeojson, geojson2feature } from '../featureCollection';
import { FEATURES_3857, FEATURES_4326 } from './fixtures';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';

describe('Convert VectorSource to Geojson', () => {
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(FEATURES_3857),
  });
  const geojson = getGeojson(vectorSource.getFeatures());
  test('should return the number of features', () => {
    expect(geojson.features.length).toBe(2);
  });
});

describe('Convert geojson to vectorSource features', () => {
  const vFeature = FEATURES_4326.features[0];
  const vFeatures = geojson2feature(vFeature);
  test('should return the number of features', () => {
    expect(vFeatures[0].values_.class).toBe('Vegetation');
  });
});

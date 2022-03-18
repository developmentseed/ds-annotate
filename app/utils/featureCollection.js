export const makeFeatureCollection = (feature) => {
  return {
    type: 'FeatureCollection',
    features: [feature]
  };
};

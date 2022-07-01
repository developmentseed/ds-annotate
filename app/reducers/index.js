export const activeClassReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_CLASS':
      return action.payload.activeClassName;
    default:
      return state;
  }
};

export const downloadGeojsonReducer = (state, action) => {
  switch (action.type) {
    case 'DOWNLOAD_GEOJSON':
      return action.payload.status;
    default:
      return state;
  }
};

export const downloadInJOSMReducer = (state, action) => {
  switch (action.type) {
    case 'DOWNLOAD_IN_JOSM':
      return action.payload.status;
    default:
      return state;
  }
};

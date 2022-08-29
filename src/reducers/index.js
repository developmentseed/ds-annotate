export const activeProjectReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_PROJECT':
      return action.payload;
    default:
      return state;
  }
};

export const activeClassReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_CLASS':
      return action.payload;
    default:
      return state;
  }
};

export const itemsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      const items = action.payload.sort((a, b) => {
        return a.values_.id < b.values_.id ? 1 : -1;
      });
      return items;
    default:
      return state;
  }
};

export const highlightedItemReducer = (state, action) => {
  switch (action.type) {
    case 'SET_HIGHLIGHTED_ITEM':
      return action.payload;
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

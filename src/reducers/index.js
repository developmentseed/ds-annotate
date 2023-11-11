export const createReducer =
  (type, sortingFunction = null, defaultValue = null) =>
  (state, action) => {
    if (action.type === type) {
      if (sortingFunction) {
        return action.payload.sort(sortingFunction);
      } else {
        return action.payload || defaultValue;
      }
    }
    return state;
  };

export const activeProjectReducer = createReducer("SET_ACTIVE_PROJECT");

export const activeClassReducer = createReducer("SET_ACTIVE_CLASS");

export const itemsReducer = createReducer("SET_ITEMS", null, []);

export const highlightedItemReducer = createReducer("SET_HIGHLIGHTED_ITEM");

export const downloadGeojsonReducer = createReducer("DOWNLOAD_GEOJSON");

export const downloadInJOSMReducer = createReducer("DOWNLOAD_IN_JOSM");

export const ItemsNumClass = createReducer("SET_ITEM_ID");

export const encodeItemsReducer = createReducer("CACHING_ENCODED");

export const activeEncodeImage = createReducer("SET_ACTIVE_ENCODE_IMAGE");

export const pointsSelectorReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_SINGLE_POINT":
      return [action.payload];
    case "SET_MULTI_POINT":
      return [...state, action.payload];
    case "SET_EMPTY_POINT":
      return [];
    default:
      return state;
  }
};

export const activeDecoderType = (state, action) => {
  switch (action.type) {
    case "SET_DECODER_TYPE":
      return action.payload;
    default:
      return state;
  }
};

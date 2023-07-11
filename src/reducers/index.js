export const createReducer =
  (type, sortingFunction = null) =>
  (state, action) => {
    if (action.type === type) {
      if (sortingFunction) {
        return action.payload.sort(sortingFunction);
      } else {
        return action.payload || {};
      }
    }
    return state;
  };

export const activeProjectReducer = createReducer("SET_ACTIVE_PROJECT");

export const activeClassReducer = createReducer("SET_ACTIVE_CLASS");

export const itemsReducer = createReducer("SET_ITEMS");

export const highlightedItemReducer = createReducer("SET_HIGHLIGHTED_ITEM");

export const downloadGeojsonReducer = createReducer("DOWNLOAD_GEOJSON");

export const downloadInJOSMReducer = createReducer("DOWNLOAD_IN_JOSM");

export const pointsSelectorReducer = createReducer(
  "SET_POINTS_SELECTORS",
  (a, b) => (a.values_.id < b.values_.id ? 1 : -1)
);

export const ItemsNumClass = createReducer("SET_ITEM_ID");

export const encodeItemsReducer = createReducer("CACHING_ENCODED");

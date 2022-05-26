export const activeClassReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_CLASS':
      return action.payload.activeClassName;
    default:
      return state;
  }
};

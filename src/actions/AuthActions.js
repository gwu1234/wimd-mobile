import {
  SET_SELECTED_ROUTE_KEY,
} from './types';


export const setSelectedRouteKey = (key) => {
  return {
    type: SET_SELECTED_ROUTE_KEY,
    payload: {
      selectedRouteKey: key
    }
  };
};


import { Actions } from 'react-native-router-flux';

import {
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  SET_USER_TAG,
  SET_EMPLOYEE_KEY,
  UPDATE_GPS_POSITION,
  SET_FRENCH,
  SET_SELECTED_ROUTE_KEY
} from '../actions/types';

const INITIAL_STATE = {
  user: null,
  userTag: '',
  employeeKey: '',
  clients: [],
  leads: [],
  employeeName: "",
  isLogin: false,
  position: null,
  isFrench: false,
  selectedRouteKey: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /*case LOGIN_USER_SUCCESS:
      Actions.main();
      return { ...state, user: action.payload.user, isLogin: true};
    case LOGOUT_USER_SUCCESS:
      return { ...state, user: null, isLogin: false};
    case SET_USER_TAG:
      return { ...state, userTag: action.payload.usertag};
    case SET_FRENCH:
      let isFrench = action.payload.isFrench;
      isFrench = !isFrench;
      return { ...state, isFrench: isFrench};
    case SET_EMPLOYEE_KEY:
      return { ...state,
        employeeKey: action.payload.employeeKey,
        userTag: action.payload.userTag,
        clients: action.payload.clients,
        truck: action.payload.truck,
        leads: action.payload.leads,
        employeeName: action.payload.employeeName,
        assignedOrders: action.payload.assignedOrders
      };
    case UPDATE_GPS_POSITION:
      //console.log("reducer: UPDATE_GPS_POSITION")
      //
      //console.log(action.payload.position)
      return { ...state,
         position: action.payload.position,
     };*/
    case SET_SELECTED_ROUTE_KEY:
      return { ...state,
         selectedRouteKey: action.payload.selectedRouteKey,
    }; 
    default:
      return state;
  }
};

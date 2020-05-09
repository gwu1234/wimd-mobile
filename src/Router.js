//import React from 'react';
import React, { Component } from 'react';
//import firebase from 'firebase';
import { Scene, Router, Actions } from 'react-native-router-flux';
//import {logoutUserSuccess} from './actions';
import { connect } from 'react-redux';
import Login from './components/Login';
import GpsMapView  from './components/GpsMapView';
import {StyleSheet} from 'react-native';

class RouterComponent extends Component {
    constructor() {
          super();
    }
    render() {

      return (
          <Router >
              <Scene key="root" hideNavBar >
                  <Scene key="login" component={Login} title="WIMD" />
                  <Scene key="gpsMap" component={GpsMapView} title="GPS Map" />
              </Scene>
         </Router>
       );
    };
};

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     justifyContent: 'center'
   },
   header: {
    alignItems: 'center'
  },
   text: {
     fontWeight: 'bold',
     fontSize: 30,
     color: 'orange'
   },
   sub: {
     fontWeight: 'normal',
     fontSize: 20,
     color: 'orange'
   }
 });

//export default RouterComponent;
export default connect(null, {
})(RouterComponent);

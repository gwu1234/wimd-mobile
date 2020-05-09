import React from 'react';
import firebase from 'firebase';
import { PROVIDER_GOOGLE } from 'expo';
import { Actions } from 'react-native-router-flux';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import {View } from 'react-native';
import { Button } from './common';

const  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};
const LOCATION_TIMER = 10000;
const INITIAL = 0;
const RUNNING = 1;
const STOPPED = 2;

export class GpsMapView extends React.Component {
  constructor() {
     super();
     this.locationTimer = 0;
     this.state = {
         clients: [],
         error: null,
         latitude: null,
         longitude: null,
         timestamp: null,
         trackRef: "",
         status: INITIAL
     };
  }

  componentDidMount() {
    console.log("componentDidMount()");
    //console.log("setup locationTimer");
    this._getLocationPermisions();
    //this.locationTimer  = setInterval(this.getCurrentLocation, LOCATION_TIMER);
    //console.log("locationTimer :", this.locationTimer);

    const {selectedRouteKey} = this.props;
    const trackPath = "routes/" + selectedRouteKey + "/tracks";
    console.log ("trackPath");
    console.log (trackPath);
    const trackRef = firebase.database().ref(trackPath);
    this.setState ({
          trackRef : trackRef,
          status: INITIAL
      });

    firebase.database().ref("routes").child(selectedRouteKey).on('value', snapshot => {
        const route = snapshot.val();
        const deliverys = [];
        const deliveries = route.deliverys;
        for (var key in deliveries) {             
             const delivery = {
                lat: deliveries[key].lat,
                lng: deliveries[key].lng,
                deliveryKey: deliveries[key].deliveryKey
             } 
             deliverys.push(delivery); 
        }  
        //console.log (deliverys);
        const trackArray = [];
        const tracks = route.tracks;
        for (var key in tracks) {             
             const track = {
                lat: tracks[key].lat,
                lng: tracks[key].lng,
                trackKey:  tracks[key].trackKey,
                timestamp: tracks[key].timestamp,
             } 
             trackArray.push(track); 
        }  
        //console.log (trackArray);
        this.setState ({
           tracks: trackArray,
           deliverys: deliverys
        })
     });  
  }

  componentWillUnmount() {  
     console.log("componentWillUnmount()");
     console.log("clear locationTimer");
     if (this.locationTimer !== 0) {
          clearInterval(this.locationTimer);
          this.locationTimer = 0;
     }
     const {selectedRouteKey} = this.props;
     firebase.database().ref("routes").child(selectedRouteKey).off() ;
 }

  success = (pos) => {
     console.log('success():');
     var crd = pos.coords;
     console.log('Your current position is:');
     console.log(`Latitude : ${crd.latitude}`);
     console.log(`Longitude: ${crd.longitude}`);
     console.log(`timestamp: ${pos.timestamp}`);
     console.log(`More or less ${crd.accuracy} meters.`);
     this.setState({
         latitude: crd.latitude,
         longitude: crd.longitude,
         timestamp: pos.timestamp,
      });

      this.updateLocation(pos);
  }

  error = (err) => {
     console.log('error():');
     console.log("getCurrentPosition error : ");
     //console.log(err);
  }

  getCurrentLocation = () => {
     console.log('getCurrentLocation():');
     navigator.geolocation.getCurrentPosition(this.success, this.error, options);
  }

  updateLocation (position){
       console.log('updateLocation():');
       console.log(position.coords.latitude);  
       const {trackRef} = this.state; 
       const trackKey = trackRef.push().getKey();

       const track = {
           lat: position.coords.latitude,
           lng: position.coords.longitude,
           timestamp: position.timestamp,
           trackKey: trackKey
       }
       trackRef.child(trackKey).set(track);
  }

  _getLocationPermisions = async () => {
    console.log('_getLocationPermission():');
    let { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        error: 'Permission to access location was denied',
      });
      console.log("GPS permission not granted");
      throw new Error('Location permission not granted');
    }
  };

  startTrack = () => {
     console.log('startTrack() :');
     console.log("start locationTimer");
     this.locationTimer  = setInterval(this.getCurrentLocation, LOCATION_TIMER);
     console.log("locationTimer :", this.locationTimer);
     this.setState ({
         //trackRef : trackRef,
         status: RUNNING
     });
   }

   pauseTrack = () => {
      console.log('pauseTrack() :');
      console.log("stop locationTimer");
      if (this.locationTimer !== 0) {
         clearInterval(this.locationTimer);
         this.locationTimer = 0;
      }
      this.setState ({
         //trackRef : trackRef,
         status: STOPPED
      });
   }

   clickStart =() => {
      const {status} = this.state;
      if (status === INITIAL) {
          this.startTrack();
      } else if (status === RUNNING) {
         this.pauseTrack();
      } else if (status === STOPPED) {
         this.startTrack();
      }
   }

   clickEnd =() => {
       this.stopTrack();
   }

   stopTrack = () => {
      console.log('stopTrack() :');
      console.log("stop locationTimer");
      if (this.locationTimer !== 0) {
         clearInterval(this.locationTimer);
         this.locationTimer = 0;
      }
      this.setState ({
         //trackRef : trackRef,
         status: STOPPED
      });
      Actions.login();
   }

  render() { 
    const {latitude, longitude, deliverys, tracks, status } = this.state;
    let clients = [];
    let clat = 45.465318 ;
    let clng = -73.833466 ;

    if (latitude && longitude) {
      clat = latitude ;
      clng = longitude ;
    }

    let startButton = "Start";
    if (status === RUNNING) {
        startButton = "Pause"
    } else if (status === STOPPED) {
        startButton = "Resume"
    }

    return (
      <View style={{ flex: 1 }}>
      <MapView
         provider={PROVIDER_GOOGLE}
         style={{ flex: 1 }}
         initialRegion={{
            latitude: clat ,
            longitude: clng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
         }}
       >
       {deliverys && deliverys.map((delivery, index) => (
            <MapView.Marker
                coordinate={{latitude:delivery.lat, longitude: delivery.lng}}
                key={delivery.deliveryKey}
                ref={_marker => this.marker = _marker}
                id = {index}
            >
               <View style={styles.blackcircle} key="blackcircle">
               </View>
            </MapView.Marker>
        ))}

        {tracks && tracks.map((track, index) => (
            <MapView.Marker
                coordinate={{latitude:track.lat, longitude: track.lng}}
                key={track.trackKey}
                ref={_marker => this.marker = _marker}
                id = {index}
            >
               <View style={styles.redcircle} key="redcircle">
               </View>
            </MapView.Marker>
        ))}  

        {clat && clng && <MapView.Marker
            coordinate={{latitude:clat, longitude:clng}}
            key={"employee_m"}
            ref={_marker => this.marker = _marker}
            id = {1234}
          >
            <View style={styles.bluecircle} key="bluecircle">
            </View>

          </MapView.Marker>}
      </MapView>
      <View style={{ position: 'absolute', top: '85%', flexDirection:"column", alignSelf: 'flex-end'}} >
           <Button onPress={()=>this.clickStart()}> {startButton} </Button>
           {status !== 0 && <Button onPress={()=>this.clickEnd()}> End </Button>}
       </View>
      </View>
    );
  }
}

const styles = {
  redcircle: {
    width: 12,
    height: 12,
    borderRadius: 12 / 2,
    backgroundColor: 'red',
  },
  bluecircle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: 'blue',
  },
  greencircle: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    backgroundColor: 'green',
  },
  blackcircle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'black',
  }
};

const mapStateToProps = state => {
    const selectedRouteKey  = state.auth.selectedRouteKey;
    console.log("GpsMapView : ");
    console.log(selectedRouteKey);
   
    return {
      selectedRouteKey: selectedRouteKey,
      clients: [],
   };
};

export default connect(mapStateToProps, {})(GpsMapView);





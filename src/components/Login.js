import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';

import {Text, View, StyleSheet} from 'react-native';

class Login extends Component {
    constructor(props) {
       super(props);
       this.state = {
         userName: "",
         password: "",
         error: "", 
         routes: null,
       }
    }

    componentDidMount() {
      firebase
      .auth()
      .signInWithEmailAndPassword("mr.guoping.wu@gmail.com", "@Kirkland!Montreal0407")
      .then(signedInUser => {
         //console.log("firebase login info : ")
         //console.log (signedInUser.user) ;

         firebase.database().ref("routes").on('value', snapshot => {
           const routes = snapshot.val();
           this.setState({
              userName: "",
              password: "", 
              routes: routes,
              error: ""
            });
          });  
      })
      .catch(err => {
        const error = "Server is Down" ;
        this.setState({ error: error});
      });
    }
  
    componentWillUnmount() {
      firebase.database().ref("routes").off() ;
      this.setState({
           userName: "",
           password: "",
           error: "",
           routes: null
       }); 
    }

    render() {
      const {routes, error} = this.state;
 
      return (
        <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.text}>WIMD App</Text>
               <Text style={styles.sub}>Where Is My Delivery </Text>
            </View>
           <LoginForm routes={routes}/>
           {error.length > 0 && <View style={{...styles.header, marginTop: 15}}>
               <Text style={styles.error}> {error} </Text>
           </View>}        
         </View>
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
   },
   error: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'red'
  }
 });

//export default RouterComponent;
export default connect(null, {
})(Login);

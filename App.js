import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import Router from './src/Router';

class App extends Component {
  constructor(props) {
    super(props);

   const config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
   };
   firebase.initializeApp(config);
    
  }

  /*componentDidMount() {
    const config = {
       apiKey: "AIzaSyBQQIWgEwaCIc2ll3Zo-zph-Xf_4zQobNg",
       authDomain: "wimd2go.firebaseapp.com",
       databaseURL: "https://wimd2go.firebaseio.com",
       projectId: "wimd2go",
       storageBucket: "wimd2go.appspot.com",
       messagingSenderId: "709418167950",
       appId: "1:709418167950:web:9693e7f25427032038e3df",
       measurementId: "G-0JXZR8J8W4"
    };
    firebase.initializeApp(config);
    //console.log("firebase configuration");
    //console.log(config);
  }*/

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;

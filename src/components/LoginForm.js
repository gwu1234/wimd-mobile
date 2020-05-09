import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Input, Button, Spinner } from './common';
import {setSelectedRouteKey} from '../actions';

class LoginForm extends Component {
  constructor() {
       super();
       this.state = {
          routeName: "",
          routePassword: "",
          error: '',
          selectedRouteKey: ""
       };
  }

  
  isRouteExist () {
      const { routes } = this.props;
      const {routeName, routePassword} = this.state;
      let exist = false ;
      let selectedRouteKey = "";
      for (var key in routes) {             
          if (routes[key].routeName == routeName && routes[key].routePassword === routePassword) {
              exist = true ;
              selectedRouteKey = routes[key].routeKey;
              console.log ("selectedRouteKey = " + selectedRouteKey)
          }  
      }
      this.setState ({selectedRouteKey: selectedRouteKey}) ;
      this.props.setSelectedRouteKey(selectedRouteKey);    
    return exist;
  }

  onRouteChange(text) {
    this.setState({routeName: text, error:""});
  }

  onPasswordChange(text) {
    this.setState({routePassword: text, error:""});
  }

  onButtonPress() {
    const { routeName, routePassword} = this.state;
    console.log(routeName);
    console.log(routePassword);

    if (this.isRouteExist ()) {
         console.log ("route exits");
         this.setState  ({
             routeName: "",
             routePassword: "",
             error: ""
          });
          Actions.gpsMap();
    } else {
         //console.log ("route not exits");
         this.setState  ({
            routeName: "",
            routePassword: "",
            error: "route id or password not exist"
         });
    }
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Login
      </Button>
    );
  }

  render() {
    const passwordString = "password";
    return (
      <Card>     
        <CardSection>
          <Input
            label="Route Id"
            placeholder="route id"
            onChangeText={this.onRouteChange.bind(this)}
            value={this.state.routeName}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label = {passwordString}
            placeholder = {passwordString}
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.state.routePassword}
          />
        </CardSection>     
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};

const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps, {
  setSelectedRouteKey
})(LoginForm);

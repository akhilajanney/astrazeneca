import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./component/login/Login";
import Header from "./component/header/Header";
import Navbar from "./component/navbar/Navbar";
import Home from "./component/pages/Home";
import Configuration from "./component/pages/Configuration";
import UploadMap from "./component/pages/UploadMap";
import Tracking from "./component/pages/Tracking";
import Assets from "./component/pages/Assets";
import SystemHealth from "./component/pages/SystemHealth";
import Alerts from "./component/pages/Alerts";
import Temperature from "./component/pages/Temperature";
import AirQuality from "./component/pages/AirQuality";
import ZoneConfig from "./component/pages/ZoneConfig";

import SensorDetails from "./component/pages/Sensors/SensorDetails";
import SensorDetailsCards from "./component/pages/Sensors/SensorDetailsCards";
import SensorDetailsGraph from "./component/pages/Sensors/SensorsDetailGraph";

import Floorzonedet from './component/pages/Floorzonedet';
import Energytag from './component/pages/Energytag';
import Passiveasset from './component/pages/Passiveasset';
import CarParking from './component/pages/CarParking';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: parseInt(0),
    };
  }

  handleUserLogin = (credentials) => {
    this.setState({ isLoggedIn: parseInt(credentials) });
  };

  render() {
    if (parseInt(sessionStorage.getItem("isLoggedIn")) === 1) {
      return (
        <Router>
          <Header handleLogin={this.handleUserLogin}></Header>
          <Navbar></Navbar>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home"></Redirect>
            </Route>
            <Route exact path="/login">
              <Redirect to="/home"></Redirect>
            </Route>
            <Route
              exact
              path="/home"
              render={(props) => (
                <Home {...props} handleLogin={this.handleUserLogin}></Home>
              )}
            />
            <Route
              exact
              path="/configuration"
              render={(props) => (
                <Configuration
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Configuration>
              )}
            />
            <Route
              exact
              path="/uploadmap"
              render={(props) => (
                <UploadMap
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></UploadMap>
              )}
            />
            <Route
              exact
              path="/zoneconfig"
              render={(props) => (
                <ZoneConfig
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></ZoneConfig>
              )}
            />
            <Route
              exact
              path="/tracking"
              render={(props) => (
                <Tracking
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Tracking>
              )}
            />
            <Route
              exact
              path="/assets"
              render={(props) => (
                <Assets {...props} handleLogin={this.handleUserLogin}></Assets>
              )}
            />
            <Route
              exact
              path="/systemhealth"
              render={(props) => (
                <SystemHealth
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></SystemHealth>
              )}
            />
            <Route
              exact
              path="/thermalmap"
              render={(props) => (
                <Temperature
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Temperature>
              )}
            />
            <Route
              exact
              path="/alerts"
              render={(props) => (
                <Alerts {...props} handleLogin={this.handleUserLogin}></Alerts>
              )}
            />
            <Route
              exact
              path="/energy"
              render={(props) => (
                <Energytag {...props} handleLogin={this.handleUserLogin}></Energytag>
              )}
            />
            <Route
              exact
              path="/passiveasset"
              render={(props) => (
                <Passiveasset {...props} handleLogin={this.handleUserLogin}></Passiveasset>
              )}
            />
            <Route
              exact
              path="/parking"
              render={(props) => (
                <CarParking {...props} handleLogin={this.handleUserLogin}></CarParking>
              )}
            />
            <Route
              exact
              path="/airquality"
              render={(props) => (
                <AirQuality
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></AirQuality>
              )}
            />

            <Route
              exact
              path="/sensordetails"
              render={(props) => (
                <SensorDetails {...props} handleLogin={this.handleUserLogin}></SensorDetails>
              )}
            />
            <Route
              exact
              path="/floorzonedet"
              render={(props) => (
                <Floorzonedet {...props} handleLogin={this.handleUserLogin}></Floorzonedet>
              )}
            />
            <Route
              exact
              path="/sensordetailscards"
              render={(props) => (
                <SensorDetailsCards {...props} handleLogin={this.handleUserLogin}></SensorDetailsCards>
              )}
            />
            <Route
              exact
              path="/sensordetailsgraph"
              render={(props) => (
                <SensorDetailsGraph {...props} handleLogin={this.handleUserLogin}></SensorDetailsGraph>
              )}
            />
          </Switch>
        </Router>
      );
    } else {
      return (
        <Router>
          <Route path="/">
            <Redirect to="/login"></Redirect>
          </Route>
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} handleLogin={this.handleUserLogin}></Login>
            )}
          />
        </Router>
      );
    }
  }
}

export default App;

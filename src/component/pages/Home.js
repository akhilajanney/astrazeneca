import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { linkClicked } from "../navbar/Navbar";
import "./Styling.css";

// Styling property for Widget Image size
const ImageSize = {
  width: "85%",
  height: "85%",
  margin: "0px",
  padding: "0px",
};

// Styling property for Underline Image
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

class Home extends Component {
  /** Method is called on Component Load */
  componentDidMount() {
    linkClicked(0);
  }

  /** Redern the html content on the browser */
  render() {
    return (
      <Fragment>
        <>
          <title>Home</title>
        </>
        <div className="panel">
          <span className="main-heading">HOME</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
          <div className="container fading" style={{ marginTop: "50px" }}>
            <div className="row">
              <span className="heading">Configuration</span>
              <br />
              <hr></hr>
              {/* Widget for Configuration, on click navigate to Configuration page */}
              <div className="col-4">
                <Link to="/configuration">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Config.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div>
              {/* Widget for Upload Floor Map, on click navigate to Upload Map page */}
              <div className="col-4">
                <Link to="/uploadmap">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Upload.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div>
              {/* Widget for All Assets, on click navigate to Assets page */}
              <div className="col-4">
                <Link to="/assets">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Assets.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div>
              {/* Widget for All Assets, on click navigate to ZOne Configuration page */}
              <div className="col-4">
                <Link to="/zoneconfig">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_ZoneConfig.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div>
            </div>
            <br></br>

            <div className="row">
              <span className="heading">Personnel Management</span>
              <br />
              <hr></hr>

              <div className="col-4">
                <Link to="/tracking">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Realtime.png"
                    style={ImageSize}
                    className="fading"
                    onClick={() => linkClicked(1)}
                  />
                </Link>
              </div>
              <div className="col-4">
              <Link to="/wastage">
                <img
                  alt=""
                  src="../images/Widgets/Widget_FoodWastage.png"
                  style={ImageSize}
                  className="fading"
                />
              </Link>
            </div>
            </div>

            <br></br>
            <div className="row">
              <span className="heading">Environment Management</span>
              <br />
              <hr></hr>
              <div className="col-4">
                <Link to="/thermalmap">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_ThermalMap.png"
                    style={ImageSize}
                    className="fading"
                    onClick={() => linkClicked(2)}
                  />
                </Link>
              </div>
              <div className="col-4">
                <Link to="/airquality">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_AirQuality.png"
                    style={ImageSize}
                    className="fading"
                    onClick={() => linkClicked(3)}
                  />
                </Link>
              </div>
            </div>

            <br></br>

            <div className="row">
            <span className="heading">Parking Allotment</span>
            <br />
            <hr></hr>
            <div className="col-4">
              <Link to="/parking">
                <img
                  alt=""
                  src="../images/Widgets/Widget_Parking.png"
                  style={ImageSize}
                  className="fading"
                />
              </Link>
            </div>
          </div>

          <br></br>

          <div className="row">
          <span className="heading">Passive Asset Tags</span>
          <br />
          <hr></hr>
          <div className="col-4">
            <Link to="/passiveasset">
              <img
                alt=""
                src="../images/Widgets/Widget_Passivetag.png"
                style={ImageSize}
                className="fading"
              />
            </Link>
          </div>
        </div>

        <br></br>
            <div className="row">
              <span className="heading">System</span>
              <br />
              <hr></hr>
              {/* Widget for System Health, on click navigate to System Health page */}
              <div className="col-4">
                <Link to="/systemhealth">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Syshealth.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div>
              {/* Widget for Alerts, on click navigate to Alerts page */}
              <div className="col-4">
                <Link to="/alerts">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Alert.png"
                    style={ImageSize}
                    className="fading"
                    onClick={() => linkClicked(4)}
                  />
                </Link>
              </div>

              <div className="col-4">
                <Link to="/sensordetails">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Sensors.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div>

              <div className="col-4">
              <Link to="/energy">
                <img
                  alt=""
                  src="../images/Widgets/Widget_Energy.png"
                  style={ImageSize}
                  className="fading"
                />
              </Link>
            </div>

              {/*<div className="col-4">
                <Link to="/vehicle">
                  <img
                    alt=""
                    src="../images/Widgets/Widget_Vehicle.png"
                    style={ImageSize}
                    className="fading"
                  />
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Home;

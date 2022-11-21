import React, { Component, Fragment } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";
import AssetReg from "./AssetReg";
import MasterGateway from "./MasterGateway";
import SlaveGateway from "./SlaveGateway";

axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.xsrfCookieName = "csrftoken";

// Styling property for Underline Image
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

const Navbtn = {
  // background: "white",
  padding: "8px 10px",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
  color: "Black",
  fontWeight: "bold",
  boxShadow: "3px 3px 5px 3px rgba(0, 0, 0, 0.25)",
};

class Configuration extends Component {
  constructor() {
    super();
    this.state = { page: "1" };
  }

  /** Method is called on Component Load */
  componentDidMount() {
    $("#b1").css("color", "white");
    $("#b1").css("background", " rgb(0, 98, 135)");
    this.props.handleLogin(1);
  }

  /** Methods to display and hide the forms on button click  */
  // Displays Asset Rgistration Form
  showAssetForm = () => {
    this.setState({ page: "1" });
    $("#b1").css("color", "white");
    $("#b1").css("background", " rgb(0, 98, 135)");
    $("#b2").css("color", "black");
    $("#b2").css("background", "#efefef");
    $("#b3").css("color", "black");
    $("#b3").css("background", "#efefef");
  };

  // Displays Master Gateway Rgistration Form
  showMasterForm = () => {
    this.setState({ page: "2" });
    $("#b2").css("color", "white");
    $("#b2").css("background", " rgb(0, 98, 135)");
    $("#b1").css("color", "black");
    $("#b1").css("background", "#efefef");
    $("#b3").css("color", "black");
    $("#b3").css("background", "#efefef");
  };

  // Displays Slave Gateway Rgistration Form
  showSlaveForm = () => {
    this.setState({ page: "3" });
    $("#b3").css("color", "white");
    $("#b3").css("background", " rgb(0, 98, 135)");
    $("#b1").css("color", "black");
    $("#b1").css("background", "#efefef");
    $("#b2").css("color", "black");
    $("#b2").css("background", "#efefef");
  };

  /** Terminate the session on forbidden (403) error */
  sessionTimeout = () => {
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  /** Redern the html content on the browser */
  render() {
    if (this.state.page === "1") {
      this.child = <AssetReg handleLoginError={this.sessionTimeout}></AssetReg>;
    } else if (this.state.page === "2") {
      this.child = (
        <MasterGateway handleLoginError={this.sessionTimeout}></MasterGateway>
      );
    } else if (this.state.page === "3") {
      this.child = (
        <SlaveGateway handleLoginError={this.sessionTimeout}></SlaveGateway>
      );
    }
    return (
      <Fragment>
        <>
          <title>Configuration</title>
        </>
        <div className="panel">
          <span className="main-heading">CONFIGURATION</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
          <div className="container fading" style={{ marginTop: "50px" }}>
            <div className="row">
              <button
                id="b1"
                className="col col-3 heading"
                style={Navbtn}
                onClick={this.showAssetForm}
              >
                Asset Registration
              </button>
              <button
                id="b2"
                className="col col-3  heading"
                style={Navbtn}
                onClick={this.showMasterForm}
              >
                Master Gateway
              </button>
              <button
                id="b3"
                className="col col-3  heading"
                style={Navbtn}
                onClick={this.showSlaveForm}
                // disabled={true}
              >
                Slave Gateway
              </button>
            </div>
            <div
              className="container"
              style={{
                borderRadius: "0px 0px 5px 5px",
                border: "2px solid rgb(2, 167, 140, 0.2)",
                boxShadow: "0px 0px 5px 1px grey",
                marginTop: "-8px",
                padding: "2% 10%",
              }}
              id="childComponent"
            >
              {this.child}
            </div>
            {/* <div className="row">
              <BulkUpload></BulkUpload>
            </div> */}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Configuration;

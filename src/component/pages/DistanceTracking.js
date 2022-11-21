import React, { Component, Fragment } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";
import { employeeDistance } from "../../urls/apis";
import { Helmet } from "react-helmet";
import { linkClicked } from "../navbar/Navbar";

// Styling property for Underline Image
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

class DistanceTracking extends Component {
  componentDidMount = () => {
    linkClicked(2);
  };

  /** Hides all error and success messages displayed on all button clicks */
  hide = () => {
    $("#conf-error").text("");
    $("#conf-success").text("");
  };

  /** Register the both sensor and tracking tags */
  getTrackingData = (e) => {
    this.hide();
    e.preventDefault();
    $("#sensorTable").empty();
    $("#distanceblock").css("display", "none");
    let empid = $("#empid").val();
    if (empid.length === 0) {
      $("#conf-error").text("Please enter employee ID.");
    } else {
      axios({
        method: "GET",
        url: employeeDistance + "?empid=" + empid,
      })
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            $("#distanceblock").css("display", "block");
            // $("#conf-success").text("Tag is allocated.");
            let data = response.data;
            if (data.length !== 0) {
              $("#empname").text(data[0].name1);
              for (let i = 0; i < data.length; i++) {
                $("#sensorTable").append(
                  "<tr><td>" +
                    (i + 1) +
                    "</td><td>" +
                    data[i].name2 +
                    "</td><td>" +
                    data[i].starttime.substr(0, 10) +
                    " " +
                    data[i].starttime.substr(11, 8) +
                    "</td><td>" +
                    data[i].endtime.substr(0, 10) +
                    " " +
                    data[i].endtime.substr(11, 8) +
                    "</td><td>" +
                    data[i].duration +
                    "</td></tr>"
                );
              }
            }
          } else {
            $("#conf-error").text("Unable to get data.");
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has timed out. Please Login again."
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" + error.response.status + ")."
            );
          }
        });
    }
  };

  /** Terminate the session on forbidden (403) error */
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLoginError();
  };

  render() {
    return (
      <Fragment>
        <>
          <title>Distance Tracking</title>
        </>
        <div className="panel">
          <span className="main-heading">Contact Tracing</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
          <div className="container fading" style={{ marginTop: "50px" }}></div>

          {/* Form for Registering the sensor and tracking tags */}
          <form id="reg-form">
            {/* Input field for Floor Name */}
            <div className="input-group">
              <span className="label">Employee ID : </span>
              <input type="text" id="empid" required="required" />
            </div>
            <div className="input-group">
              <input
                type="submit"
                value="Get Data"
                onClick={this.getTrackingData}
                className="btn success-btn"
              />
            </div>
          </form>
          <div>
            {/* Element for displaying error messages */}
            <span className="error-msg" id="conf-error"></span>
          </div>
          <br></br>
          <div id="distanceblock" style={{ display: "none" }}>
            <span className="heading">
              Distance Tracking Data for Employee : <span id="empname"></span>
            </span>
            <br />
            <img
              src="../images/Tiles/Underline.png"
              alt=""
              style={{
                width: "56px",
                height: "3px",
                marginTop: "2px",
                position: "absolute",
              }}
            />
            {/* Table displays Sensor tags registered */}
            <table
              style={{
                marginTop: "20px",
                marginBottom: "30px",
              }}
            >
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>EMPLOYEE NAME</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                  <th>DURATION</th>
                </tr>
              </thead>
              <tbody id="sensorTable"></tbody>
            </table>
          </div>
        </div>

        {/* Display modal to display error messages */}
        <div id="displayModal" className="modal">
          <div className="modal-content">
            <p id="content" style={{ textAlign: "center" }}></p>
            <button
              id="ok"
              className="btn-center btn success-btn"
              onClick={this.sessionTimeout}
            >
              OK
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DistanceTracking;

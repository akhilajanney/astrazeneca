import React, { Component, Fragment } from "react";
import axios from "axios";
import $ from "jquery";
import "./Styling.css";
import { employeeRegistration } from "../../urls/apis";

// Styling property for Underline Image
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

class Reports extends Component {
  componentDidMount() {
    $("#report-error").text("");
    axios({ method: "GET", url: employeeRegistration + "?key=all" })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data.length !== 0) {
            $("reportsTable").empty();
            const data = response.data;
            console.log("REPORTS DATA====>", data);
            for (let i = 0; i < data.length; i++) {
              let tagid = "NOT ASSIGNED";
              let intime = "--:--:--";
              let lastseen = "--:--:--";
              if (data[i].tagid) {
                tagid = data[i].tagid;
                intime = data[i].intime.substring(0, 19).replace("T", " ");
                lastseen = data[i].lastseen.substring(0, 19).replace("T", " ");
              }
              $("#reportsTable").append(
                "<tr>" +
                "<td>" + (1 + i) + "</td>" +
                "<td>" + data[i].name + "</td>" +
                "<td>" + data[i].email + "</td>" +
                "<td>" + tagid + "</td>" +
                "<td>" + intime + "</td>" +
                "<td>" + lastseen + "</td>" +
                "</tr>"
              );
            }
          } else {
            $("#report-error").text("No Employee data found.");
          }
        }
      })
      .catch((error) => {
        console.log("error====>", error);
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else {
          $("#report-error").text(
            "Request Failed with status code (" + error.response.status + ")."
          );
        }
      });
  }

  /** Terminate the session on forbidden (403) error */
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  /** Redern the html content on the browser */
  render() {
    return (
      <Fragment>
        <>
          <title>Reports</title>
        </>
        <div className="panel">
          <span className="main-heading">Reports</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

          <div className="container fading" style={{ marginTop: "20px" }}>
            <p className="error-msg" id="report-error"></p>
            {/* SIGNAL REPEATER TAGS TABLE */}
            <div className="container" style={{ marginTop: "20px" }} >
              <span className="heading">Employee Daily Report</span>
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
                    <th>NAME</th>
                    <th>MAIL ID</th>
                    <th>MAC ID</th>
                    <th>IN TIME</th>
                    <th>LAST SEEN</th>
                  </tr>
                </thead>
                <tbody id="reportsTable"></tbody>
              </table>
              {/* Page navigation options for sensor tags */}
              <div
                style={{
                  textAlign: "center",
                  display: "none",
                }}
              >
                <p style={{ float: "left", fontFamily: "Roboto-Regular" }}>
                  ( <span id="currentpage">0</span> /
                  <span id="numberofpages">0</span> )
                </p>
                <button
                  id="previous"
                  onClick={this.previousSPage}
                  style={{ fontFamily: "Roboto-Medium" }}
                >
                  Previous
                </button>
                <button
                  id="next"
                  onClick={this.nextSPage}
                  style={{ fontFamily: "Roboto-Medium" }}
                >
                  Next
                </button>
                <p style={{ float: "right", fontFamily: "Roboto-Regular" }}>
                  Row count : <span id="rowCount">0</span>
                </p>
              </div>
            </div>
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

export default Reports;

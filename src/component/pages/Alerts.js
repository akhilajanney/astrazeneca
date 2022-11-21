import React, { Component, Fragment } from "react";
import { linkClicked } from "../navbar/Navbar";
import axios from "axios";
import $ from "jquery";
import "./Styling.css";
import { getPagination, TableDetails, DataLoading } from './common'
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

class Alerts extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      error: false,
      message: ''
    };
  }
  componentDidMount() {
    linkClicked(4);
    this.getAlertData("first");
    this.interval = setInterval(() => {
      this.getAlertData("repeat");
    }, 15 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAlertData = (callStatus) => {
    this.setState({ error: false, message: "" });
    if (callStatus === "first") {
      this.setState({ loading: true });
    } else {
      this.setState({ loading: false });
    }
    let alertTypeId = $("#type").val();
    axios({ method: "POST", url: "/api/alerts", data: { value: alertTypeId } })
      .then((response) => {
        $(".pagination").hide();
        $("#rangeDropdown").hide();
        $("#table_det tbody").empty();
        $("#table_det thead").empty();
        let data = response.data;
        if (response.status === 200 || response.status === 201) {
          console.log("Alerts Response====>", response);
          if (data.length !== 0) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>MAC ID</th>" +
              "<th>EMPLOYEE NAME</th>" +
              "<th>ALERT TYPE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            let i = 0;
            let sno = 1;
            for (i = data.length - 1; i >= 0; i--) {
              var alert = "";
              let timestamp = data[i].timestamp.substring(0, 19).replace("T", " ");
              if (data[i].value === 1) alert = "Panic Button";
              else if (data[i].value === 3) alert = "Free Fall";
              else if (data[i].value === 4) alert = "No activity";
              else if (data[i].value === 5) alert = "Low Battery";
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (sno) + "</td>" +
                "<td>" + data[i].asset.tagid + "</td>" +
                "<td>" + data[i].asset.name + "</td>" +
                "<td>" + alert + "</td>" +
                "<td>" + timestamp + "</td>" +
                "</tr>"
              );
              sno += 1;
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
            this.setState({ loading: false });
          }
          else {
            this.setState({ error: true, message: 'No Alert Data Found' });
            this.setState({ loading: false });
          }
        }
      })
      .catch((error) => {

        this.setState({ loading: false });
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has Timed Out. Please Login Again");
        } else if (error.response.status === 404) {
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          this.setState({ error: true, message: 'No Alert Data Found' })
        } else {
          this.setState({ error: true, message: 'Request Failed' })
        }
      });
  };

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  render() {
    const { loading, error, message } = this.state;
    return (
      <>
        <div className="panel"
          style={{
            height: loading === true ? "600px" : "auto",
            overflow: loading === true ? "hidden" : "none",
          }}>
          <span className="main-heading">ALERTS</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
          <div className="container fading" style={{ marginTop: "50px" }}>
            <div className="row">
              {/* Select list for tag type */}
              <div className="input-group">
                <span className="label">Event Type : </span>
                <select name="type" id="type" onChange={() => this.getAlertData("first")}>
                  <option value="1">Panic Button</option>
                  <option value="3">Free Fall</option>
                  <option value="4">No Activity</option>
                  <option value="5">Low Battery</option>
                </select>
              </div>
            </div>

            <br></br>
            {error && (
              <div
                style={{ color: "red" }}>
                <strong>{message}</strong>
              </div>
            )}

            <TableDetails />

            {loading === true && (
              <div
                style={{
                  top: "0%",
                  left: "0%",
                }} className="frame">
                <DataLoading />
              </div>
            )}

          </div>
        </div>
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
      </>
    );
  }
}

export default Alerts;

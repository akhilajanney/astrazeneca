import React, { Component } from 'react'
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


export default class Passiveasset extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: false,
      message: ''
    };
  }
  componentDidMount() {
    this.tableDetails("first");
    this.interval = setInterval(() => {
      this.tableDetails("repeat");
    }, 15 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tableDetails = (callStatus) => {
    this.setState({ error: false, message: "" });
    if (callStatus === "first") {
      this.setState({ loading: true });
    } else {
      this.setState({ loading: false });
    }
    axios({ method: 'GET', url: '/api/passive/asset' })
      .then((response) => {
        $(".pagination").hide();
        $("#rangeDropdown").hide();
        $("#table_det tbody").empty();
        $("#table_det thead").empty();
        let data = response.data;
        if (response.status === 200 || response.status === 201) {
          console.log("Response====>", response);
          if (data.length !== 0) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>MAC ID</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );

            for (let i = 0; i < data.length; i++) {
              let timestamp = data[i].timestamp.substring(0, 19).replace("T", " ");
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].tag + "</td>" +
                "<td>" + timestamp + "</td>" +
                "</tr>"
              );
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
            this.setState({ loading: false });
          }
          else {
            this.setState({ error: true, message: 'No  Data Found' });
            $(".pagination").hide();
            $("#rangeDropdown").hide();
            $("#table_det tbody").empty();
            $("#table_det thead").empty();
            this.setState({ loading: false });
          }
        } else {
          this.setState({ error: true, message: 'No  Data Found' });
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          this.setState({ loading: false });
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
          this.setState({ error: true, message: 'No Data Found' })
        } else {
          this.setState({ error: true, message: 'Request Failed' })
        }
      });

  }
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };
  render() {
    const { error, loading, message } = this.state;
    return (
      <div className="panel"
        style={{
          height: loading === true ? "600px" : "auto",
          overflow: loading === true ? "hidden" : "none",
        }}>
        <span className="main-heading">PASSIVE ASSET</span>
        <br />
        <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
        <div className="container fading" style={{ marginTop: "50px" }}>
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
      </div>

    );
  }

}
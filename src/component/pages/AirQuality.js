import React, { Component } from "react";
import {
  irqSensor,
  dailyIAQData,
  weeklyIAQData,
  monthlyIAQData,
} from "../../urls/apis";
import axios from "axios";
import $ from "jquery";
import { linkClicked } from "../navbar/Navbar";
import ApexCharts from 'react-apexcharts';
import { DataLoading, floorMap, chartOption } from './common';

const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
  zIndex: "-1",
};
const graphBtn = {
  padding: "8px 10px",
  border: "none",
  marginLeft: "15px",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
  color: "Black",
  fontWeight: "bold",
  boxShadow: "3px 3px 5px 3px rgba(0, 0, 0, 0.25)",
};

class AirQuality extends Component {
  fWidth = 0;
  fHeight = 0;
  floorData = [];
  constructor() {
    super();
    this.state = {
      error: false,
      message: '',
      iaqMacId: "",
      loading: false,
      series: [],
      chartOpts: {},
      chartColor: [],
    };
  }

  componentDidMount = async () => {
    linkClicked(3);
    this.chart_Option(["#352cf2", "#11610c"]);
    this.floor = await floorMap();
    if (this.floor.floorData.length !== 0) {
      this.floorData = this.floor.floorData;
      $("#floorBlock").css("display", "block");
      this.plotFloorMap();
    } else {
      this.setState({
        loading: false,
        error: this.floor.error,
        message: this.floor.message
      });
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  };

  chart_Option = async (graphColor) => {
    this.setState({ chartColor: graphColor });
    let value = await chartOption(graphColor, "yyyy-MM-dd HH:mm");
    this.setState({ chartOpts: value });
  }

  optionChange = (btnId) => {
    this.setState({ loading: true })
    $("#opt0").css({ background: "none", color: "#000" });
    $("#opt1").css({ background: "none", color: "#000" });
    $("#opt2").css({ background: "none", color: "#000" });
    $("#" + btnId).css({ background: "rgb(0, 98, 135)", color: "#FFF" });
  };

  plotFloorMap = () => {
    this.setState({ error: false, message: '' })
    let floorID = $("#fname").val();
    this.fimage = this.floorData[floorID];
    this.fWidth = this.fimage.width;
    this.fHeight = this.fimage.height;
    $("#tempimg").attr("src", this.fimage.image);
    $("#tempimg").attr("style", "width:auto;height:auto;");
    $("#lastupdated").css("display", "none");
    $("#temp").children("div").remove();
    $("#tempChart").remove();
    $("#temp .circle").remove();
    $("#graph_opt").css("display", "none")
    $("input[type=text]").val("");
    this.timeout = setTimeout(() => {
      $("#temp .circle").remove();
      this.floorDisplay();
      this.plotSensors();
    }, 1 * 1000);
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.plotSensors()
    }, 15 * 1000);
  };

  floorDisplay = () => {
    this.wp = document.getElementById("temp").clientWidth;
    this.hp = document.getElementById("temp").clientHeight;
    $("#tempimg").attr(
      "style",
      "width:" + this.wp + "px;height:" + this.hp + "px;"
    );
  };

  plotSensors = () => {
    let fname = $("#fname").val();
    axios({
      method: "GET",
      url: irqSensor + "?floorid=" + this.floorData[fname].id,
    })
      .then((response) => {
        console.log("PlotSensors====>", response);
        let wpx = this.wp / this.fWidth;
        let hpx = this.hp / this.fHeight;
        if (response.status === 200) {
          $("#temp .circle").remove();
          let data = response.data;
          if (data.length !== 0) {
            $("#lastupdated").css("display", "block");
            $("#total").text(data.length);
            $("#timing").text(data[0].lastseen.substring(0, 19).replace("T", " "));
            for (let i = 0; i < data.length; i++) {
              let bgColor = "#581845";
              if (data[i].tvoc >= 0 && data[i].tvoc <= 50) bgColor = "green";
              else if (data[i].tvoc >= 51 && data[i].tvoc <= 100) bgColor = "#1dfa02";
              else if (data[i].tvoc >= 101) bgColor = "red";
              var iaq = document.createElement("i");
              $(iaq).attr("class", "circle");
              $(iaq).attr("id", data[i].macid);
              $(iaq).on("click", () => {
                this.setState({ iaqMacId: data[i].macid })
                this.getGraphData(dailyIAQData, data[i].macid, "opt0");
              });
              $(iaq).attr(
                "style",
                "background:" +
                bgColor +
                ";cursor:pointer; padding:5px; position:absolute;  left:" +
                data[i].x * wpx +
                "px; top:" +
                data[i].y * hpx +
                "px;"
              );
              $(iaq).attr("title", data[i].macid);
              $("#temp").append(iaq);
            }
          } else {
            $("#total").text("0");
            this.setState({ error: true, message: 'No Sensor Data Found' })
          }
        } else {
          $("#total").text("0");
          this.setState({ error: true, message: 'Unable to get Tags Data.' })
        }
      })
      .catch((error) => {
        $("#total").text("0");
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: 'No Sensor Data Found' })
        } else {
          this.setState({ error: true, message: 'Request Failed' })
        }
      });
  };

  getGraphData = (apiurl, id, btnOpt) => {
    this.optionChange(btnOpt);
    this.setState({ error: false, message: '', series: [] })
    $("#graph_opt").css("display", "block");
    $("#chartID").text(id);
    this.tagID = id;
    axios({
      method: "GET",
      url: apiurl + "?macaddress=" + id,
    })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data;
          console.log("graph====>", response)
          if (data.length !== 0) {
            let co2 = [], iaq = [];
            for (let i = 0; i < data.length; i++) {
              let time = data[i].timestamp.substring(0, 19);
              let date = new Date(time);
              let ms = date.getTime();
              co2.push([ms, data[i].co2]);
              iaq.push([ms, data[i].tvoc]);
            }
            this.setState({
              series: [
                { name: 'CO2 ', data: co2 },
                { name: 'IAQ ', data: iaq }
              ]
            });
            this.setState({ loading: false });
            window.scrollTo(0, document.body.scrollHeight);
          } else {
            this.setState({ error: true, loading: false, message: 'No Graph Data Found' })
            window.scrollTo(0, 0);
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 404) {
          this.setState({ error: true, loading: false, message: 'No Graph Data Found' })
          window.scrollTo(0, 0);
        } else {
          this.setState({ error: true, loading: false, message: 'Request Failed' })
        }
      });
  };

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  render() {
    const { error, message, loading, iaqMacId, chartOpts, series } = this.state;
    return (
      <div className="panel"
        style={{
          overflow: loading === true ? "hidden" : "visible",
          height: loading === true ? "500px" : "auto",
        }}>
        <span className="main-heading">AIR QUALITY PARAMETERS</span>
        <br />
        <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
        <div className="container fading" style={{ marginTop: "50px" }}>
          <div className="row">
            <div className="input-group">
              <span className="label">Floor Name : </span>
              <select
                name="type"
                id="fname"
                onChange={() => {
                  this.plotFloorMap();
                }}
              ></select>
              <span
                className="sub-heading"
                id="lastupdated">
                <strong > Last Updated : </strong>
                <span id="timing">00:00:00</span>
              </span>
            </div>
          </div>
          {error && (
            <div className="error-msg">
              <strong>{message}</strong>
            </div>
          )}
          <div id="floorBlock" style={{ display: "none" }}>
            <div className="row">
              <hr></hr>
            </div>
            <div className="row sub-heading" style={{ color: "black" }}>
              <div className="row">
                Total Sensors :{" "}
                <u>
                  <span id="total">0</span>
                </u>
              </div>
              <br></br>
              <div className="row sub-heading" style={{ fontSize: "1.2vw" }}>
                <div
                  className="square"
                  style={{
                    backgroundColor: "green",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                ></div>
                Excellent
                <div style={{ display: "inline" }}> ( 0-50 )</div>
                <div
                  className="square"
                  style={{
                    backgroundColor: "#1DFA02",
                    display: "inline-block",
                    marginRight: "10px",
                    marginLeft: "20px",
                  }}
                ></div>
                Good
                <div style={{ display: "inline" }}>( 51-100 )</div>
                <div
                  className="square"
                  style={{
                    backgroundColor: "red",
                    display: "inline-block",
                    marginRight: "10px",
                    marginLeft: "20px",
                  }}
                ></div>
                Bad
                <div style={{ display: "inline" }}> {"( > 100)"}</div>
              </div>
            </div>
            <div
              id="temp"
              style={{
                display: "block",
                position: "relative",
                width: "fit-content",
              }}>
              <img id="tempimg" alt=""></img>
            </div>
            <div id="graph_opt" style={{ display: "none", marginBottom:"15px" }}>
              <hr></hr>
              <div className="sub-heading" style={{ textDecoration: "none" }}>
                IAQ Sensor ID : <span id="chartID"></span>
              </div>
              <br></br>
              <button
                id="opt0"
                className="heading"
                style={graphBtn}
                onClick={() => this.getGraphData(dailyIAQData, iaqMacId, "opt0")}
              >
                Daily Count
              </button>
              <button
                id="opt1"
                className="heading"
                style={graphBtn}
                onClick={() => this.getGraphData(weeklyIAQData, iaqMacId, "opt1")}
              >
                Weekly Count
              </button>
              <button
                id="opt2"
                className="heading"
                style={graphBtn}
                onClick={() => this.getGraphData(monthlyIAQData, iaqMacId, "opt2")}
              >
                Monthly Count
              </button>

              {series.length > 0 ? (
                <div style={{ width: "95%" }}>
                  <div
                    id="chart-timeline">
                    <ApexCharts
                      options={chartOpts}
                      series={series}
                      type="area"
                      height={380} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {loading === true && (
          <div
            style={{
              top: "0%",
              left: "0%",
            }} className="frame">
            <DataLoading />
          </div>
        )}
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
      </div>
    );
  }
}

export default AirQuality;

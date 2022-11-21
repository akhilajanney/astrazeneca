import React, { Component } from "react";
import { linkClicked } from "../navbar/Navbar";
import axios from "axios";
import $ from "jquery";
import "./Styling.css";
import ApexCharts from 'react-apexcharts';
import moment from "moment";
import { DataLoading, floorMap, chartOption } from './common';
import {
    dailySensorData,
    weeklySensorData,
    monthlySensorData,
    tempertureSensor,
} from "../../urls/apis";

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

class Temperature extends Component {
    fWidth = 0;
    fHeight = 0;
    floorData = [];
    constructor() {
        super();
        this.state = {
            inactive: 0,
            error: false,
            message: '',
            sensorMacId: "",
            loading: false,
            series: [],
            chartOpts: {},
            chartColor: [],
        }
    }

    componentDidMount = async () => {
        linkClicked(2);
        this.chart_Option(["#ff1a1a", "#11610c"]);
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

    componentWillUnmount() {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    plotFloorMap = () => {
        this.setState({ error: false, message: '', inactive: 0 })
        let floorID = $("#fname").val();
        this.fimage = this.floorData[floorID];
        this.fWidth = this.fimage.width;
        this.fHeight = this.fimage.height;
        $("#tempimg").attr("src", this.fimage.image);
        $("#tempimg").attr("style", "width:auto;height:auto;");
        $("#lastupdated").css("display", "none");
        $("#temp").children("div").remove();
        $("#tempChart").remove();
        $("#temp .square").remove();
        $("#graph_opt").css("display", "none")
        $("input[type=text]").val("");
        this.timeout = setTimeout(() => {
            $("#temp .square").remove();
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
            url: tempertureSensor + "?floorid=" + this.floorData[fname].id,
        })
            .then((response) => {
                console.log("PlotSensors====>", response);
                let wpx = this.wp / this.fWidth;
                let hpx = this.hp / this.fHeight;
                if (response.status === 200) {
                    $("#temp .square").remove();
                    let data = response.data;
                    if (data.length !== 0) {
                        $("#lastupdated").css("display", "block");
                        let inactiveCount = 0;
                        for (let i = 0; i < data.length; i++) {
                            let childDiv = document.createElement("div");
                            let xaxis = 0, yaxis = 0;
                            xaxis = parseInt(wpx * parseFloat(data[i].x1));
                            yaxis = parseInt(hpx * parseFloat(data[i].y1));
                            let senWidth = Math.ceil((data[i].x2 - data[i].x1) * wpx) - 3;
                            let senHeight = Math.ceil((data[i].y2 - data[i].y1) * hpx) - 3;
                            $(childDiv).attr("id", data[i].macid);

                            let mil = new Date() - new Date(data[i].lastseen.replace("T", " ").substr(0, 19));
                            if (mil <= (86400 * 1000)) {// Within 24hrs will display green
                                $(childDiv).attr(
                                    "title",
                                    "\nMAC ID : " +
                                    data[i].macid +
                                    "\nTemperature  : " +
                                    (data[i].temperature).toFixed(0) +
                                    "\nHumidity : " +
                                    data[i].humidity.toFixed(0)
                                );
                                $(childDiv).attr("class", "square");
                                $(childDiv).on("click", () => {
                                    this.setState({ sensorMacId: data[i].macid });
                                    this.getGraphData(dailySensorData, data[i].macid, "opt0");
                                });
                                if (parseFloat(data[i].temperature) < 25) {
                                    var clr = 120;
                                    if (parseInt(data[i].temperature) === 24) clr = 100;
                                    else if (parseInt(data[i].temperature) === 23) clr = 80;
                                    else if (parseInt(data[i].temperature) === 22) clr = 60;
                                    else if (parseInt(data[i].temperature) === 21) clr = 40;
                                    else if (parseInt(data[i].temperature) === 20) clr = 20;
                                    $(childDiv).attr(
                                        "style",
                                        "border:0.5px solid black; background-color:rgb(0," +
                                        clr +
                                        ",255,0.5); position: absolute; cursor: pointer;" +
                                        "left:" +
                                        xaxis +
                                        "px;top:" +
                                        yaxis +
                                        "px;width:" +
                                        senWidth +
                                        "px;height:" +
                                        senHeight +
                                        "px;"
                                    );
                                } else if (
                                    parseFloat(data[i].temperature) >= 25 &&
                                    parseFloat(data[i].temperature) <= 30
                                ) {
                                    clr = 240;
                                    if (parseInt(data[i].temperature) === 30) clr = 240;
                                    else if (parseInt(data[i].temperature) === 29) clr = 200;
                                    else if (parseInt(data[i].temperature) === 28) clr = 160;
                                    else if (parseInt(data[i].temperature) === 27) clr = 120;
                                    else if (parseInt(data[i].temperature) === 26) clr = 80;
                                    else if (parseInt(data[i].temperature) === 25) clr = 40;
                                    $(childDiv).attr(
                                        "style",
                                        "border:0.5px solid black; background-color:rgb(0,255," +
                                        clr +
                                        ",0.5); position: absolute; cursor: pointer; left:" +
                                        xaxis +
                                        "px;top:" +
                                        yaxis +
                                        "px;width:" +
                                        senWidth +
                                        "px;height:" +
                                        senHeight +
                                        "px;"
                                    );
                                } else if (parseFloat(data[i].temperature) > 30) {
                                    clr = 250;
                                    if (parseInt(data[i].temperature) === 35) clr = 250;
                                    else if (parseInt(data[i].temperature) === 34) clr = 200;
                                    else if (parseInt(data[i].temperature) === 33) clr = 150;
                                    else if (parseInt(data[i].temperature) === 32) clr = 100;
                                    else if (parseInt(data[i].temperature) === 31) clr = 50;
                                    $(childDiv).attr(
                                        "style",
                                        "border:0.5px solid black; background-color: rgb(255, " +
                                        clr +
                                        ", 0, 0.5); position: absolute; cursor: pointer; left:" +
                                        xaxis +
                                        "px;top:" +
                                        yaxis +
                                        "px;width:" +
                                        senWidth +
                                        "px;height:" +
                                        senHeight +
                                        "px;"
                                    );
                                }
                            }
                            else {
                                inactiveCount += 1;
                                $(childDiv).attr(
                                    "title",
                                    "\nMAC ID : " +
                                    data[i].macid +
                                    "\nTemperature  : " +
                                    data[i].temperature.toFixed(0) +
                                    "\nHumidity : " +
                                    data[i].humidity.toFixed(0) +
                                    "\nLastseen : " +
                                    data[i].lastseen.substring(0, 19).replace("T", " ")
                                );
                                $(childDiv).attr("class", "square");
                                $(childDiv).attr(
                                    "style",
                                    "border:0.5px solid black; background-color: rgba(255,0, 0,0.4);" +
                                    "position: absolute;left: " +
                                    xaxis +
                                    "px;top:" +
                                    yaxis +
                                    "px;width:" +
                                    senWidth +
                                    "px;height:" +
                                    senHeight +
                                    "px;"
                                );
                            }
                            $("#temp").append(childDiv);
                        }
                        this.setState({ inactive: inactiveCount });
                        $("#total").text(data.length);
                        $("#timing").text(data[0].lastseen.substring(0, 19).replace("T", " "));
                    } else {
                        $("#total").text("0");
                        this.setState({ error: true, message: 'No Sensor Data Found' })
                    }
                } else {
                    $("#total").text("0");
                    this.setState({ error: true, message: 'Unable To Get Tags Data' })
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

    chart_Option = async (graphColor) => {
        this.setState({ chartColor: graphColor });
        let value = await chartOption(graphColor, "yyyy-MM-dd HH:mm:ss");
        this.setState({ chartOpts: value });
    }

    getGraphData = (apiurl, id, btnOpt) => {
        this.optionChange(btnOpt);
        this.setState({ error: false, message: '', series: [] })
        $("#graph_opt").css("display", "block");
        $("#chartID").text(id);
        this.tagID = id;
        axios({
            method: "POST",
            url: apiurl + id,
        })
            .then((response) => {
                if (response.status === 200) {
                    let data = response.data;
                    console.log("graph====>", response)
                    if (data.length !== 0) {
                        let tempData = [], humidData = [];
                        for (let i = 0; i < data.length; i++) {
                            let time = data[i].timestamp.substring(0, 19);
                            let date = new Date(time);
                            let ms = date.getTime();
                            tempData.push([ms, data[i].temperature]);
                            humidData.push([ms, data[i].humidity]);
                        }
                        this.setState({
                            series: [
                                { name: 'Temperature(°C) ', data: tempData },
                                { name: 'Humidity(RH) ', data: humidData }
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

    optionChange = (btnId) => {
        this.setState({ loading: true })
        $("#opt0").css({ background: "none", color: "#000" });
        $("#opt1").css({ background: "none", color: "#000" });
        $("#opt2").css({ background: "none", color: "#000" });
        console.log("----->", btnId);
        $("#" + btnId).css({ background: "rgb(0, 98, 135)", color: "#FFF" });
    };

    sessionTimeout = () => {
        $("#displayModal").css("display", "none");
        sessionStorage.setItem("isLoggedIn", 0);
        this.props.handleLogin(0);
    };

    render() {
        const { inactive, error, message, chartOpts,
            sensorMacId, loading, series } = this.state;
        return (
            <>
                <div className="panel"
                    style={{
                        overflow: loading === true ? "hidden" : "visible",
                        height: loading === true ? "500px" : "auto",
                    }}>
                    <span className="main-heading">THERMAL MAP</span>
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
                                    }}>
                                </select>

                                <span
                                    className="sub-heading"
                                    id="lastupdated">
                                    <strong> Last Updated : </strong>
                                    <span id="timing">00:00:00</span>{" "}
                                </span>
                            </div>
                        </div>
                        <br />
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
                                <div className="row sub-heading">
                                    <div
                                        className="square"
                                        style={{
                                            backgroundColor: "blue",
                                            display: "inline-block",
                                            marginRight: "10px",
                                        }}
                                    ></div>
                                    Cold
                                    <div style={{ display: "inline" }}> ( &lt;25&deg;C )</div>
                                    <div
                                        className="square"
                                        style={{
                                            backgroundColor: "green",
                                            display: "inline-block",
                                            marginRight: "10px",
                                            marginLeft: "20px",
                                        }}
                                    ></div>
                                    Optimum
                                    <div style={{ display: "inline" }}>
                                        {" "}
                                        ( 25&deg;C - 30&deg;C )
                                    </div>
                                    <div
                                        className="square"
                                        style={{
                                            backgroundColor: "orange",
                                            display: "inline-block",
                                            marginRight: "10px",
                                            marginLeft: "20px",
                                        }}
                                    ></div>
                                    Warm
                                    <div style={{ display: "inline" }}> ( &gt;30&deg;C )</div>

                                    <div
                                        className="square"
                                        style={{
                                            backgroundColor: "rgba(255,0, 0,0.7)",
                                            display: "inline-block",
                                            marginRight: "10px",
                                            marginLeft: "20px",
                                        }}
                                    ></div>Inactive ({inactive})
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
                            <div id="graph_opt" style={{ display: "none", marginBottom: "15px" }}>
                                <hr></hr>
                                <div className="sub-heading" style={{ textDecoration: "none" }}>
                                    Thermal Map for Sensor ID : <span id="chartID"></span>
                                </div>
                                <br></br>
                                <button
                                    id="opt0"
                                    className="heading"
                                    style={graphBtn}
                                    onClick={() => this.getGraphData(dailySensorData, sensorMacId, "opt0")}
                                >
                                    Daily Count
                                </button>
                                <button
                                    id="opt1"
                                    className="heading"
                                    style={graphBtn}
                                    onClick={() => this.getGraphData(weeklySensorData, sensorMacId, "opt1")}
                                >
                                    Weekly Count
                                </button>
                                <button
                                    id="opt2"
                                    className="heading"
                                    style={graphBtn}
                                    onClick={() => this.getGraphData(monthlySensorData, sensorMacId, "opt2")}
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
                            <br></br>
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
            </>
        );
    }
}

export default Temperature;

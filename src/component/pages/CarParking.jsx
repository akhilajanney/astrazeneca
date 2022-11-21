import React, { Component } from 'react'
import axios from "axios";
import $ from "jquery";
import "./Styling.css";
import { DataLoading } from './common';


const Underline = {
    width: "75px",
    height: "9px",
    position: "absolute",
};

export default class CarParking extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            error: false,
            message: ''
        };
    }

    componentDidMount() {
        this.getCarParkingData();
        this.interval = setInterval(() => {
            this.getCarParkingData();
        }, 5 * 1000);
    }

    getCarParkingData = () => {
        axios({ method: "GET", url: "/api/parking" })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    let data = response.data;
                    console.log("getCarParkingData-------->", response);
                    if (data.length !== 0) {
                        $(".car-block-data").show();
                        if (data.length > 1) {
                            for (let i = 0; i < data.length; i++) {
                                $("#car-macid-" + i).text("MAC ID : " + data[i].tag);
                                $("#car-lastseen-" + i).text("Last Seen : " +
                                    data[i].timestamp.substring(0, 19).replace("T", " "));
                                $("#carblock-" + i).attr("src", data[i].vehicle_status === true ?
                                    "../images/Icons/RedCar.svg" : "../images/Icons/CarParking.png");
                            }
                        } else {
                            if (data[0].tag === "5a-c2-15-11-00-15") {
                                $("#car-macid-0").text("MAC ID : " + data[0].tag);
                                $("#car-lastseen-0").text("Last Seen : " +
                                    data[0].timestamp.substring(0, 19).replace("T", " "));
                                $("#carblock-0").attr("src", data[0].vehicle_status === true ?
                                    "../images/Icons/RedCar.svg" : "../images/Icons/CarParking.png");
                            } else {
                                $("#car-macid-1").text("MAC ID : " + data[0].tag);
                                $("#car-lastseen-1").text("Last Seen : " +
                                    data[0].timestamp.substring(0, 19).replace("T", " "));
                                $("#carblock-1").attr("src", data[0].vehicle_status === true ?
                                    "../images/Icons/RedCar.svg" : "../images/Icons/CarParking.png");
                            }
                        }
                    } else {
                        $(".car-block-data").hide();
                        $(".carImg").attr("src", "../images/Icons/CarParking.png");
                    }
                }
            })
            .catch((error) => {
                console.log("getCarParkingData-------->", error);
                this.setState({ loading: false });
                $(".car-block-data").hide();
                $(".carImg").attr("src", "../images/Icons/CarParking.png");
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                    $("#content").html("User Session has Timed Out.<br\> Please Login Again");
                }
            })

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

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
                    <span className="main-heading">PARKING ALLOTMENT</span>
                    <br />
                    <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

                    {error && (
                        <div
                            style={{ margin: "20px 0 -20px 0", color: "red" }}>
                            <strong>{message}</strong>
                        </div>
                    )}
                    <div style={{ display: "flex", marginBottom: "10px", marginTop: "30px" }}>
                        <div className='carpark-color'>
                            <div className='carpark-color-text'
                                style={{
                                    background: "red"
                                }}></div><span>Occupied</span>
                        </div>
                        <div className='carpark-color'>
                            <div className='carpark-color-text'
                                style={{
                                    marginLeft: "30px",
                                    background: "green",
                                }}></div><span>Available</span>
                        </div>
                    </div>

                    <div className='car-container'>
                        <div className="car-block">
                            <span className='car-block-data'
                                id="car-macid-0" style={{ left: "20px" }}>MAC ID : --</span>
                            <span className='car-block-data'
                                id="car-lastseen-0" style={{ right: "15px" }}>Last Seen : --</span>
                            <img className='carImg' id="carblock-0" alt=""
                                src="../images/Icons/CarParking.png"
                                style={{ width: "35%", marginTop: "20px" }}
                            />
                        </div>

                        <img src="../images/Icons/CarParking_Divider.png" alt=""
                            style={{ height: "95%" }}
                        />

                        <div className="car-block">
                            <span className='car-block-data'
                                id="car-macid-1" style={{ left: "20px" }}>MAC ID : --</span>
                            <span className='car-block-data'
                                id="car-lastseen-1" style={{ marginLeft: "195px" }}>Last Seen : --</span>
                            <img className='carImg' id="carblock-1" src="../images/Icons/CarParking.png" alt=""
                                style={{ width: "35%", marginTop: "20px" }}
                            />
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
        )
    }
}

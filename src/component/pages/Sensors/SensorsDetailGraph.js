import React, { Component, Fragment } from "react";
import axios from "axios";
import $ from "jquery";
import "../Styling.css";
import ApexCharts from 'react-apexcharts';
import { DataLoading, floorMap, chartOption } from '../common';
import { sensors_details_macId_details } from "../../../urls/apis";

const Underline = {
   width: "75px",
   height: "9px",
   position: "absolute",
};


export default class SensorsDetailGraph extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         series: [],
         chartOpts: {},
         chartColor: [],
         error: false,
         message: "",
         lastseen: "",
         macId: "",
         column: "",
      }
   }

   componentDidMount() {
      let macId = this.props.location.state.macId;
      let column = this.props.location.state.column;
      this.chart_Option(["#0a2efc"]);
      console.log('Sensors Macid------->', this.props.location.state);
      this.setState({ macId: macId, column: column })
      this.sensorData(macId, column, "first");
      this.interval1 = setInterval(() => this.sensorData(macId, column, "repeat"), 15 * 1000);
   }

   componentWillUnmount() {
      clearInterval(this.interval1);
   }

   chart_Option = async (graphColor) => {
      this.setState({ chartColor: graphColor });
      let value = await chartOption(graphColor, "yyyy-MM-dd HH:mm:ss");
      this.setState({ chartOpts: value });
   }

   sensorData = (macid, column, callStatus) => {
      if (callStatus === "first") {
         this.setState({ loading: true });
      } else {
         this.setState({ loading: false });
      }
      axios({
         method: "POST", url: sensors_details_macId_details,
         data: { column: column, mac: macid }
      })
         .then((response) => {
            const data = response.data;
            console.log('Response ======>', response);
            if (data.length !== 0 && response.status === 200) {
               let graphData = [], graphName = "";
               if (column === "Temp") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "Temperature";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].Temp.toFixed(1)]);
                  }
               } else if (column === "Humi") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "Humidity";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].Humi.toFixed(1)]);
                  }
               }
               else if (column === "Co2") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "CO2";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].Co2.toFixed(1)]);
                  }
               }
               else if (column === "VOC") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "VOC";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].VOC.toFixed(1)]);
                  }
               }
               else if (column === "O2") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "O2";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, ((data[i].O2) + 7).toFixed(2)]);
                  }
               }
               else if (column === "PM1") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "PM1";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].PM1.toFixed(1)]);
                  }
               }
               else if (column === "PM2") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "PM2";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].PM2.toFixed(1)]);
                  }
               }
               else if (column === "PM4") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "PM4";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].PM4.toFixed(1)]);
                  }
               }
               else if (column === "PM10") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "PM10";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].PM10.toFixed(1)]);
                  }
               }
               else if (column === "PtSize") {
                  for (let i = 0; i < data.length; i++) {
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].PtSize.toFixed(1)]);
                     graphName = "PtSize";
                  }
               }
               this.setState({
                  series: [
                     { name: graphName, data: graphData }
                  ]
               });
               console.log("###########", graphData);
               $("#sensor_details_graph").css("display", "block");
               $("#chartID").text(macid);
               this.setState({ loading: false });
            } else {
               $("#sensor_details_graph").css("display", "none");
               $("#report-error").text(
                  "No Data Found On MACID : " + this.state.macId
               );
               this.setState({ loading: false });
            }
         })
         .catch((error) => {
            $("#sensor_details_graph").css("display", "none");
            this.setState({ loading: false });
            console.log("Graph Error====>", error);
            if (error.response.status === 403) {
               $("#displayModal").css("display", "block");
               $("#content").text(
                  "User Session has timed out."
               );
               $("#content1").text(
                  "Please Login again."
               );
            } else {
               $("#report-error").text(
                  "Request Failed with status code (" + error.response.status + ")."
               );
            }
         })
     
   }

   /** Terminate the session on forbidden (403) error */
   sessionTimeout = () => {
      $("#displayModal").css("display", "none");
      sessionStorage.setItem("isLoggedIn", 0);
      this.props.handleLogin(0);
   };

   render() {
      const { macId, loading, series, chartOpts } = this.state;
      return (
         <Fragment>
            <>
               <title>Sensor Details</title>
            </>
            <div className="panel">
               <span className="main-heading">Sensor Details</span><br />
               <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

               <p style={{ fontSize: '20px', marginTop: '40px', color: '#198ebb', fontWeight: 600 }}>
                  <strong style={{ color: 'gray', fontSize: '23px' }}>Sensor MACID :</strong>   {macId}
               </p>
               <div className="container fading">
                  <p className="error-msg" id="report-error" style={{ fontWeight: 600 }}></p>
                  <div className="container" style={{ paddingBottom: '20px' }}>
                     <div id="sensor_details_graph" style={{ display: "none" }}>
                        {series.length > 0 ? (
                           <div style={{ width: "95%" }}>
                              <div
                                 id="chart-timeline">
                                 <ApexCharts
                                    options={{
                                       chart: {
                                          id: "area-datetime",
                                          type: "area",
                                          height: 380,
                                          curve: "smooth",
                                          zoom: {
                                             autoScaleYaxis: true,
                                          },
                                       },
                                       stroke: {
                                          width: 2,
                                       },
                                       dataLabels: {
                                          enabled: false,
                                       },
                                       markers: {
                                          size: 0,
                                       },
                                       xaxis: {
                                          type: "datetime",
                                          tickAmount: 1,
                                          labels: {
                                             datetimeUTC: false,
                                          },
                                       },
                                       yaxis: {
                                          labels: {
                                             formatter: function (val) {
                                                if (val >= 1)
                                                   return val.toFixed(0)
                                                else
                                                   return val.toFixed(2)
                                             }
                                          }
                                       },
                                       tooltip: {
                                          x: {
                                             format: "yyyy-MM-dd HH:mm:ss",
                                          },
                                          y: {
                                             formatter: function (val) {
                                                return val
                                             }
                                          },
                                       },
                                       colors: ["#0a2efc"],
                                    }}
                                    series={series}
                                    type="area"
                                    height={380} />
                              </div>
                           </div>
                        ) : null}
                     </div>
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
                  <p id="content1" style={{ textAlign: "center", marginTop: '-13px' }}></p>
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
      )
   }
}

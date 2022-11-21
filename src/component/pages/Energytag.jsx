import React, { Component } from 'react'
import ApexCharts from 'react-apexcharts';
import { DataLoading, chartOption } from './common';
import axios from "axios";
import $ from "jquery";
import Lottie from 'react-lottie';
import animationData from '../animations/nographdata.json';

const Underline = {
   width: "75px",
   height: "9px",
   position: "absolute",
};

export default class Energytag extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lastseen: '',
         macId: " ",
         current: 0,
         voltage: 0,
         energy: 0,
         powerfactor: 0,
         loading: false,
         series: [],
         chartOpts: {},
         chartColor: [],
         graph_name: "energy",
         error: false,
         column: " ",
      }
   }
   componentDidMount() {
      this.chart_Option(["#0a2efc"]);
      this.energyData("first");
      this.interval = setInterval(() => {
         this.energyData("repeat")
      }, 10 * 1000);

   }

   energyData = (callStatus) => {
      axios({ method: 'GET', url: '/api/energy' })
         .then((response) => {
            if (response.status === 200 || response.status === 201) {
               let data = response.data;
               console.log("Energy Response===>", response)
               if (data.length !== 0) {
                  let macId = data.tag;
                  this.setState({
                     lastseen: data.timestamp.substring(0, 19).replace("T", " "),
                     macId: data.tag,
                     current: data.current.toFixed(2),
                     voltage: data.voltage.toFixed(2),
                     powerfactor: data.powerFactor.toFixed(2),
                     energy: data.energy.toFixed(3)
                  })
                  this.sensorData(macId, this.state.graph_name, callStatus)

               } else {
                  $("#graphAnime").show();
                  $("#report-error").text(
                     "No Energy Data Found"
                  );
               }
            }
         })

         .catch((error) => {
            $("#sensor_details_graph").css("display", "none");
            $("#graphAnime").show();
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
               $("#sensor_details_graph").css("display", "none");
               $("#graphAnime").show();
            }
         })

   }
   componentWillUnmount() {
      clearInterval(this.interval);
   }

   chart_Option = async (graphColor) => {
      this.setState({ chartColor: graphColor });
      let value = await chartOption(graphColor, "yyyy-MM-dd HH:mm:ss");
      this.setState({ chartOpts: value });
   }
   sensorData = (macId, column, callStatus) => {
      console.log(macId, "--------->", column);
      this.setState({ graph_name: column });
      if (callStatus === "first") {
         this.setState({ loading: true });
      } else {
         this.setState({ loading: false });
      }
      axios({
         method: "POST", url: "/api/energy",
         data: { column: column, mac: macId }
      })
         .then((response) => {
            const data = response.data;
            console.log('Graph Response ======>', response);
            if (data.length !== 0 && response.status === 200) {
               let graphData = [], graphName = "";
               if (column === "energy") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "Energy";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].energy.toFixed(3)]);
                  }
               }
               else if (column === "current") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "Current";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].current.toFixed(2)]);
                  }
               }
               else if (column === "voltage") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "Voltage";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].voltage.toFixed(2)]);
                  }
               }
               else if (column === "powerFactor") {
                  for (let i = 0; i < data.length; i++) {
                     graphName = "Power Factor";
                     let time = data[i].timestamp.substring(0, 19);
                     let date = new Date(time);
                     let ms = date.getTime();
                     graphData.push([ms, data[i].powerFactor.toFixed(2)]);
                  }
               }
               this.setState({
                  series: [
                     { name: graphName, data: graphData }
                  ]
               });
               $("#egraphname").text(column + " Graph")
               $("#sensor_details_graph").css("display", "block");
               $("#chartID").text(macId);
               this.setState({ loading: false });
            } else {
               $("#egraphname").text(column + " Graph")
               $("#sensor_details_graph").css("display", "none");
               $("#graphAnime").show();
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
               $("#sensor_details_graph").css("display", "none");
               $("#graphAnime").show();
            }
         })
   }

   sessionTimeout = () => {
      $("#displayModal").css("display", "none");
      sessionStorage.setItem("isLoggedIn", 0);
      this.props.handleLogin(0);
   };

   render() {
      const { loading, macId,
         lastseen, current, voltage, powerfactor, energy,
         series } = this.state;
      return (
         <>
            <div className="panel">
               <span className="main-heading">Energy Details</span><br />
               <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

               <p className="error-msg" id="report-error"></p>

               <p style={{ fontSize: '21px', marginTop: '40px', color: '#198ebb', fontWeight: 600 }}>
                  <strong style={{ color: 'gray', fontSize: '23px', fontFamily: "Roboto-Regular" }}>MAC ID : </strong>
                  {macId}
                  <strong style={{
                     color: 'gray',
                     fontSize: '23px',
                     marginLeft: "100px",
                     fontFamily: "Roboto-Regular"
                  }}>Last Updated : </strong>  {lastseen}
               </p>

               <div style={{ display: 'flex' }}>
                  <div style={{ width: '350px', height: '400px' }}>
                     <div className='ecard' onClick={() => { this.sensorData(macId, "energy", "first") }}>
                        <h2>Energy (kWh)</h2>
                        <p><span id="sensor_value">{energy}</span></p>
                     </div>
                     <div className='ecard' onClick={() => { this.sensorData(macId, "current", "first") }}>
                        <h2>Current (A)</h2>
                        <p><span id="sensor_value">{current}</span></p>
                     </div>
                     <div className='ecard' onClick={() => { this.sensorData(macId, "voltage", "first") }}>
                        <h2>Voltage (V)</h2>
                        <p><span id="sensor_value">{voltage}</span></p>
                     </div>
                     <div className='ecard' onClick={() => { this.sensorData(macId, "powerFactor", "first") }}>
                        <h2>Power Factor</h2>
                        <p><span id="sensor_value">{powerfactor}</span></p>
                     </div>
                  </div>
                  <div className='egraph_div'>
                     <span id="egraphname"></span>
                     <div id="sensor_details_graph" style={{ display: "none" }}>
                        {series.length > 0 ? (
                           <div style={{ width: "95%" }}>
                              <div style={{ marginTop: '5px' }}
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
                                                    return val.toFixed(3)
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
                                    height={310} />
                              </div>
                           </div>
                        ) : null}
                     </div>

                     <div
                        id="graphAnime"
                        style={{
                           width: "83%",
                           height: "50vh",
                           border: "1px solid #d5d5d5",
                           margin: "auto",
                           marginTop: "15px",
                           padding: 'auto',
                           textAlign: "center",
                           display: "none"
                        }}>

                        <h3 style={{ textAlign: "center", color: "red" }}>
                           No Graph Data Found!
                        </h3>
                        <Lottie
                           options={{
                              loop: true,
                              autoplay: true,
                              animationData: animationData,
                              rendererSettings: {
                                 preserveAspectRatio: 'xMidYMid slice'
                              }
                           }}
                           width={350}
                           height={300}
                           style={{
                              position: "relative",
                              margin: "-8% 0px 0px 12%",
                              padding: "0"
                           }}
                        />
                     </div>
                     {loading === true && (
                        <div
                           style={{
                              width: "700px",
                              height: "400px",
                              top: "35%",
                              left: "33%",
                              boxShadow: "none",
                              background: "white"
                           }} className="frame">
                           <DataLoading />
                        </div>
                     )}
                  </div>
               </div>
            </div>

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
         </>
      )
   }
}

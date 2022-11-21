import React, { PureComponent, Fragment } from "react";
import axios from "axios";
import $ from "jquery";
import "../Styling.css";
// import html2pdf from "html2pdf.js";
import { sensors_details_macId_details } from "../../../urls/apis";
// import SensorDetails from './SensorDetails';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './AstraZeneca_logo.png';
import { Link } from "react-router-dom";

const Underline = {
   width: "75px",
   height: "9px",
   position: "absolute",
};

class SensorDetailsCards extends PureComponent {
   /** Method is called on Component Load */
   constructor(props) {
      super(props);
      this.state = {
         lastseen: '',
         macId: "",
      }
   }

   componentDidMount() {
      const macid = this.props.location.state.macId
      console.log('Sensors Macid------->', macid);
      this.setState({ macId: macid })
      this.sensorsDetails(macid);
      this.interval1 = setInterval(() => this.sensorsDetails(macid), 15 * 1000);
   }

   componentWillUnmount() {
      clearInterval(this.interval1);
   }

   sensorsDetails = (macId) => {
      axios({ method: "GET", url: sensors_details_macId_details + '?macaddress=' + macId })
         .then((response) => {
            if (response.status === 200 || response.status === 201) {
               var dt = response.data;
               console.log('sensorsDetails ======>', response);
               if (response.data.length !== 0) {
                  this.setState({
                     lastseen: dt[0].timestamp.substring(0, 19).replace("T", " ")
                  })
                  for (let i = 0; i < dt.length; i++) {
                     $("#0 .card  #sensor_value").text(dt[i].Temp.toFixed(2))
                     $("#1 .card  #sensor_value").text(dt[i].Humi.toFixed(2))
                     $("#2 .card  #sensor_value").text(dt[i].Co2.toFixed(2))
                     $("#3 .card  #sensor_value").text(dt[i].VOC.toFixed(2))
                     $("#4 .card  #sensor_value").text(((dt[i].O2)+7).toFixed(2))
                     $("#5 .card  #sensor_value").text(dt[i].PM1.toFixed(2))
                     $("#6 .card  #sensor_value").text(dt[i].PM2.toFixed(2))
                     $("#7 .card  #sensor_value").text(dt[i].PM4.toFixed(2))
                     $("#8 .card  #sensor_value").text(dt[i].PM10.toFixed(2))
                     $("#9 .card  #sensor_value").text(dt[i].PtSize.toFixed(2))
                  }
               }
            }
         })
         .catch((error) => {
            console.log('error=====>', error);
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
         });
   }

   /** Terminate the session on forbidden (403) error */
   sessionTimeout = () => {
      $("#displayModal").css("display", "none");
      sessionStorage.setItem("isLoggedIn", 0);
      this.props.handleLogin(0);
   };

   downloadpdf = () => {
      // console.log('DOWNLOAD PDfffff----->', this.state.macId);
      let macid = this.state.macId.toString()
      const doc = new jsPDF();
      doc.autoTable({
         showHead: "everyPage",
         didDrawPage: function (data) {
            // Logo image 
            doc.addImage(logo, 'PNG', 70, 10, 70, 20);

            // Header
            doc.setFontSize(20);
            doc.setTextColor(100);
            doc.text('Facility Environmental Parameters', 50, 40);

            // Below of header Line 
            doc.setLineWidth(1);
            doc.line(10, 45, 200, 45);

            // Sensors Details 
            // Tower Data
            doc.setFontSize(14);
            doc.setTextColor(20);
            doc.text('Tower : ', 15, 55);
            doc.setFontSize(14);
            doc.setTextColor(70);
            doc.text('-', 35, 55);

            // Display Date 
            doc.setFontSize(14);
            doc.setTextColor(20);
            doc.text('Date : ', 145, 55);
            doc.setFontSize(14);
            doc.setTextColor(70);
            doc.text(new Date().toISOString().slice(0, 10), 163, 55);

            // Floor Data
            doc.setFontSize(14);
            doc.setTextColor(20);
            doc.text('Floor : ', 15, 65);
            doc.setFontSize(14);
            doc.setTextColor(70);
            doc.text('-', 35, 65);

            // Zone Data
            doc.setFontSize(14);
            doc.setTextColor(20);
            doc.text('Zone : ', 15, 75);
            doc.setFontSize(14);
            doc.setTextColor(70);
            doc.text('-', 35, 75);

            // Sensor MacID 
            doc.setFontSize(14);
            doc.setTextColor(20);
            doc.text('Sensor ID : ', 15, 85);
            doc.setFontSize(14);
            doc.setTextColor(70);
            doc.text(macid, 45, 85);

         },
         theme: 'grid',
         margin: { top: 90, right: 14, bottom: 0, left: 14 },
         styles: {
            halign: 'center',
         },
         head: [['SL.NO', 'PARAMETERS', 'UNITS', 'RESULTS', 'LIMITS', 'STANDARD REFERENCE']],
         body: [
            ['1', 'RELATIVE HUMIDITY', '%', $("#1 .card  #sensor_value").text(), '30 to 60', 'ASHRAE'],
            ['2', 'TEMPERATURE', '°C', $("#0 .card  #sensor_value").text(), '*', 'ASHRAE'],
            ['3', 'RESPIRABLE PARTICULATE', 'mg/m³', '--', '0.05', 'ASHRAE'],
            ['4', 'CARBON MONOXIDE(CO)', 'mg/m³', '--', '9', 'ASHRAE'],
            ['5', 'OXYGEN(O2)', '%', $("#4 .card  #sensor_value").text(), '>19.5', "OSHA'S"],
            ['6', 'CARBON DIOXIDE(CO2)', 'PPM', $("#2 .card  #sensor_value").text(), '1000', 'ASHRAE'],
            ['7', 'HEAT STRESS', '°C', '--', '**', "OSHA'S"],
            ['8', 'INDOOR AIR QUALITY (IAQ)', '--', $("#3 .card  #sensor_value").text(), '--', '--'],
            ['9', 'PARTICAL SIZE (PtSIZE)', 'mm/1000', $("#5 .card  #sensor_value").text(), '--', "--"],

         ],
      })
      doc.save('Report.pdf')
   };

   /** Redern the html content on the browser */
   render() {
      const { macId, lastseen } = this.state;
      return (
         <Fragment>
            <div className="panel">
               <span className="main-heading">Sensor Details</span><br />
               <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

               <p style={{ fontSize: '21px', marginTop: '40px', color: '#198ebb', fontWeight: 600 }}>
                  <strong style={{ color: 'gray', fontSize: '23px', fontFamily: "Roboto-Regular" }}>MAC ID : </strong>
                  {macId}
                  <strong style={{
                     color: 'gray',
                     fontSize: '23px',
                     marginLeft: "50px",
                     fontFamily: "Roboto-Regular"
                  }}>Last Updated : </strong>  {lastseen}
                  <button className="sensor_pdf_button"
                     onClick={this.downloadpdf}>
                     Report
                     <span>
                        <i className="fa fa-arrow-circle-o-down"
                           style={{ marginLeft: '5px', fontSize: '23px' }}>
                        </i>
                     </span>
                  </button>
               </p>

               <div className="container fading">
                  <p className="error-msg" id="report-error"></p>
                  <div className="container" style={{ paddingBottom: '20px' }}>
                     <div className="row">
                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "Temp" }
                        }}>
                           <div className="column" id="0">
                              <div className="card">
                                 <h2>Temperature (°C)</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>

                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "Humi" }
                        }}>
                           <div className="column" id="1">
                              <div className="card">
                                 <h2>Humidity (%RH)</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>

                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "Co2" }
                        }}>
                           <div className="column" id="2">
                              <div className="card">
                                 <h2>CO2 (ppm)</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>
                     </div>

                     <p className="cardHeading">
                        IAQ Index
                     </p>

                     <div className="row">
                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "VOC" }
                        }}>
                           <div className="column" id="3">
                              <div className="card">
                                 <h2>VOC</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>
                     </div>

                     <p className="cardHeading">
                        O2 Details
                     </p>
                     <div className="row">
                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "O2" }
                        }}>
                           <div className="column" id="4">
                              <div className="card">
                                 <h2>O2 (%)</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>
                     </div>

                     <p className="cardHeading">
                        Respiratory Particulate Matter(PM)
                     </p>
                     <div className="row">
                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "PM1" }
                        }}>
                           <div className="column" id="5">
                              <div className="card">
                                 <h2>PM1.0</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>

                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "PM2" }
                        }}>
                           <div className="column" id="6">
                              <div className="card">
                                 <h2>PM2.5</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>

                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "PM4" }
                        }}>
                           <div className="column" id="7">
                              <div className="card">
                                 <h2>PM4.0</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>

                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "PM10" }
                        }}>
                           <div className="column" id="8">
                              <div className="card">
                                 <h2>PM10.0</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>
                     </div>


                     <p className="cardHeading">
                        Particulate Size(PtSize)
                     </p>
                     <div className="row">
                        <Link to={{
                           pathname: "/sensordetailsgraph",
                           state: { macId: macId, column: "PtSize" }
                        }}>
                           <div className="column" id="9">
                              <div className="card">
                                 <h2>PtSize</h2>
                                 <p><span id="sensor_value"></span></p>
                              </div>
                           </div>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
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
      );
   }
}

export default SensorDetailsCards;

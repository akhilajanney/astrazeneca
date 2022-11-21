import React, { Component, Fragment } from "react";
import axios from "axios";
import $ from "jquery";
import "../Styling.css";
import { sensors_details_macIds } from "../../../urls/apis";
import { Link } from "react-router-dom";

const Underline = {
   width: "75px",
   height: "9px",
   position: "absolute",
};

export default class SensorDetails extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lastseen: '',
         macId: "",
         sensorDet: [],
      }
   }

   componentDidMount() {
      this.sensorsDetails();
      this.interval = setInterval(() => {
         this.sensorsDetails()
      }, 15 * 1000);
   }

   sensorsDetails = () => {
      $("#sensor_error").text("");
      this.setState({ sensorDet: [] });
      axios({ method: "GET", url: sensors_details_macIds })
         .then((response) => {
            if (response.status === 200 || response.status === 201) {
               var dt = response.data;
               console.log('======>', response);
               if (dt.length !== 0) {
                  let datas = [];
                  for (let i = 0; i < dt.length; i++) {
                     let timestamp = dt[i].timestamp.substring(0, 19).replace("T", " ");
                     let status = "red";
                     if (new Date() - new Date(timestamp) <= 2 * 60 * 1000) {
                        status = "green";
                     }

                     datas.push({
                        sno: (i + 1).toString(),
                        macid: dt[i].MACID,
                        lastseen: timestamp,
                        status: status,
                     })
                  }
                  this.setState({ sensorDet: datas });
               } else {
                  $("#sensor_error").text("No Sensor Data found.");
               }
            }
         })
         .catch((error) => {
            console.log('error=====>', error);
            if (error.response.status === 403) {
               $("#displayModal").css("display", "block");
               $("#content").text("User Session has timed out.");
               $("#content1").text("Please Login again.");
            } else if (error.response.status === 404) {
               $("#sensor_error").text("No Sensor Data found.");
            } else {
               $("#sensor_error").text(
                  "Request Failed with status code (" + error.response.status + ")."
               );
            }
         });
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
      const { sensorDet } = this.state;
      return (
         <Fragment>
            <>
               <title>Sensor Details</title>
            </>
            <div className="panel">
               <span className="main-heading">Sensor Details</span><br />
               <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
               <div className="container fading">
                  <p className="error-msg" id="sensor_error"></p>
                  <div className="container">

                     {/* Table displays Sensor tags registered */}
                     <table
                        style={{
                           marginTop: "20px",
                           marginBottom: "30px",
                        }}
                     >
                        <thead>
                           <tr>
                              <th>SL.No</th>
                              <th>MAC ID</th>
                              <th>LAST SEEN</th>
                              <th>STATUS</th>
                              <th>DETAILS</th>
                           </tr>
                        </thead>
                        <tbody id="sensorTable">
                           {
                              sensorDet.map((item, index) => (
                                 <tr key={index}>
                                    <td>{item.sno}</td>
                                    <td>{item.macid}</td>
                                    <td>{item.lastseen}</td>
                                    <td>{item.status === "red" ? (
                                       <div className='circle'
                                          style={{ margin: 'auto', backgroundColor: "red", }}>
                                       </div>) : (
                                       <div className='circle'
                                          style={{ margin: 'auto', backgroundColor: "green", }}>
                                       </div>
                                    )}
                                    </td>
                                    <td>
                                       <Link to={{
                                          pathname: '/sensordetailscards',
                                          state: { macId: item.macid }
                                       }}>
                                          <img src="../images/Icons/sensor_info.png"
                                             alt=""
                                             style={{ width: '25px' }} />
                                       </Link>
                                    </td>
                                 </tr>
                              ))
                           }
                        </tbody>
                     </table>
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
      )
   }
}

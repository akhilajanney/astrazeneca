import React, { Component, Fragment } from "react";
import axios from "axios";
import $ from "jquery";
import "./Styling.css";
import moment from "moment";
import { getPagination, TableDetails,DataLoading} from './common'
import {
  irqSensor,
  employeeRegistration,
  masterGateway,
  signalRepeator,
  slaveGateway,
  tempertureSensor,
} from "../../urls/apis";

const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

class SystemHealth extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      error: false,
      loading: false,
    };
  }
  componentDidMount() {
    this.getTableDetails("first");
    this.interval = setInterval(() => {
       this.getTableDetails("repeat");
    }, 15 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  getTableDetails = (callStatus) => {
    this.setState({ error: false, message: "" });
    if (callStatus === "first") {
       this.setState({ loading: true });
    } else {
       this.setState({ loading: false });
    }
    if ($("#healthtype").val() === "Master") {
       axios({ method: "GET", url: masterGateway})
          .then((response) => {
             const data = response.data;
             console.log("Master Response====>", data);
             $(".pagination").hide();
             $("#rangeDropdown").hide();
             $("#table_det tbody").empty();
             $("#table_det thead").empty();
             if (data.length !== 0 && response.status === 200) {
                $("#table_det thead").append(
                   "<tr>" +
                   "<th>SNO</th>" +
                   "<th>MASTER ID</th>" +
                   "<th>FLOOR NAME</th>" +
                   "<th>LAST SEEN</th>" +
                   " <th>STATUS</th>" +
                   "</tr>"
                );
                for (let i = 0; i < data.length; i++) {
                   let status = 'red';
                   if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                      status = "green";
                   }
                   $("#table_det tbody").append(
                      "<tr class=row_" + (i + 1) + ">" +
                      "<td>" + (i + 1) + "</td>" +
                      "<td>" + data[i].gatewayid + "</td>" +
                      "<td>" + data[i].floor.name + "</td>" +
                      "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                      "<td><div class='circle' style='margin:auto;background-color:" +
                      status +
                      ";'></div></td> " +
                      "</tr>"
                   )
                }
                if (data.length > 25) {
                   $(".pagination").show();
                   $("#rangeDropdown").show();
                   getPagination(this, "#table_det");
                }
                this.setState({ loading: false });
             } else {
                this.setState({ message: "No Master Data Found!", error: true, loading: false });
             }
          })

          .catch((error) => {
             console.log("ERROR====>", error);
             this.setState({ loading: false });
              if (error.response.status === 403) {
                $("#displayModal").css("display", "block");
                $("#content").text("User Session has timed out. Please Login again.");
             }else  if (error.response.status === 404) {
              this.setState({error:true,message:'No Master Data Found'})
              $("#table_det thead").empty();
              $("#table_det tbody").empty();
           }
          })
    }
    else if ($("#healthtype").val() === "Slave") {
       axios({ method: "GET", url: slaveGateway })
          .then((response) => {
             const data = response.data;
             console.log('=====>slave', data);
             $(".pagination").hide();
             $("#rangeDropdown").hide();
             $("#table_det tbody").empty();
             $("#table_det thead").empty();
             if (data.length !== 0 && response.status === 200) {
                $("#table_det thead").append(
                   "<tr>" +
                   "<th>SNO</th>" +
                   "<th>SLAVE ID</th>" +
                   "<th>MASTER ID</th>" +
                   "<th>FLOOR NAME</th>" +
                   "<th>LAST SEEN</th>" +
                   " <th>STATUS</th>" +
                   "</tr>"
                );
                for (let i = 0; i < data.length; i++) {
                   let status = 'red';
                   if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                      status = "green";
                   }
                   $("#table_det tbody").append(
                      "<tr class=row_" + (i + 1) + ">" +
                      "<td>" + (i + 1) + "</td>" +
                      "<td>" + data[i].gatewayid + "</td>" +
                      "<td>" + data[i].master.gatewayid + "</td>" +
                      "<td>" + data[i].master.floor.name + "</td>" +
                      "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                      "<td><div class='circle' style='margin:auto;background-color:" +
                      status +
                      ";'></div></td> " +
                      "</tr>"
                   )
                }
                if (data.length > 25) {
                   $(".pagination").show();
                   $("#rangeDropdown").show();
                   getPagination(this, "#table_det");
                }
                this.setState({ loading: false });
             } else {
                this.setState({ message: "No Slave Data Found!", error: true, loading: false });
             }
          })
          .catch((error) => {
             console.log('Health Slave Gate Error====', error);
             this.setState({ loading: false });
             if (error.response.status === 403) {
                $("#displayModal").css("display", "block");
                $("#content").text("User Session has timed out. Please Login again.");
             }else  if (error.response.status === 404) {
              this.setState({error:true,message:'No Slave Data Found'})
              $("#table_det thead").empty();
              $("#table_det tbody").empty();
           }
          })
    } else if ($("#healthtype").val() === 'Assets') {
       axios({ method: "GET", url: employeeRegistration + "?key=all"  })
          .then((response) => {
             const data = response.data;
             console.log('=====>', response);
             $(".pagination").hide();
             $("#rangeDropdown").hide();
             $("#table_det tbody").empty();
             $("#table_det thead").empty();
             if (data.length !== 0 && response.status === 200) {
                $("#table_det thead").append(
                   "<tr>" +
                   "<th>SNO</th>" +
                   "<th>ASSET NAME</th>" +
                   "<th>ASSET ID</th>" +
                   "<th>BATTERY STATUS(%)</th>" +
                   "<th>LAST SEEN</th>" +
                   " <th>STATUS</th>" +
                   "</tr>"
                );
                for (let i = 0; i < data.length; i++) {
                   let status = 'red';
                   if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                      status = "green";
                   }
                   $("#table_det tbody").append(
                      "<tr class=row_" + (i + 1) + ">" +
                      "<td>" + (i + 1) + "</td>" +
                      "<td>" + data[i].name + "</td>" +
                      "<td>" + data[i].tagid + "</td>" +
                      "<td>" + data[i].battery + "</td>" +
                      "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                      "<td><div class='circle' style='margin:auto;background-color:" +
                      status +
                      ";'></div></td> " +
                      "</tr>"
                   )
                }
                if (data.length > 25) {
                   $(".pagination").show();
                   $("#rangeDropdown").show();
                   getPagination(this, "#table_det");
                }
                this.setState({ loading: false });
             } else {
                this.setState({ message: "No Asset Data Found!", error: true, loading: false });
             }
          })
          .catch((error) => {
             console.log('Health asset tag gate Error====', error);
             this.setState({ loading: false });
             if (error.response.status === 403) {
                $("#displayModal").css("display", "block");
                $("#content").text("User Session has timed out. Please Login again.");
             }else  if (error.response.status === 404) {
              this.setState({error:true,message:'No Asset Data Found'})
              $("#table_det thead").empty();
              $("#table_det tbody").empty();
           }
          })
    }
    else if ($("#healthtype").val() === 'Sensors') {
      axios({ method: "GET", url: tempertureSensor  })
         .then((response) => {
            const data = response.data;
            console.log('=====>', response);
            $(".pagination").hide();
            $("#rangeDropdown").hide();
            $("#table_det tbody").empty();
            $("#table_det thead").empty();
            if (data.length !== 0 && response.status === 200) {
               $("#table_det thead").append(
                  "<tr>" +
                  "<th>SNO</th>" +
                  "<th>MAC ID </th>" +
                  "<th>SENSOR TYPE</th>" +
                  "<th>BATTERY STATUS(%)</th>" +
                  "<th>LAST SEEN</th>" +
                  " <th>STATUS</th>" +
                  "</tr>"
               );
               for (let i = 0; i < data.length; i++) {
                  let status = 'red';
                  let mil = new Date() - new Date(data[i].lastseen.replace("T", " ").substr(0, 19));
                  if (mil <= (86400 * 1000)) { // Within 24hrs will display green
                     status = "green";
                  }
                  $("#table_det tbody").append(
                     "<tr class=row_" + (i + 1) + ">" +
                     "<td>" + (i + 1) + "</td>" +
                     "<td>" + data[i].macid + "</td>" +
                     "<td>" + "Temp/Humid Sensor" +"</td>" +
                     "<td>" + data[i].battery + "</td>" +
                     "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                     "<td><div class='circle' style='margin:auto;background-color:" +
                     status +
                     ";'></div></td> " +
                     "</tr>"
                  )
               }
               if (data.length > 25) {
                  $(".pagination").show();
                  $("#rangeDropdown").show();
                  getPagination(this, "#table_det");
               }
               this.setState({ loading: false });
            } else {
               this.setState({ message: "No Sensors Data Found!", error: true, loading: false });
            }
         })
         .catch((error) => {
            console.log('Health Sensors Tag Gate Error====', error);
            this.setState({ loading: false });
            if (error.response.status === 403) {
               $("#displayModal").css("display", "block");
            }else  if (error.response.status === 404) {
              this.setState({error:true,message:'No Sensor Data Found'})
              $("#table_det thead").empty();
              $("#table_det tbody").empty();
           }
         })
   }
   else if ($("#healthtype").val() === 'Signal Repeaters') {
    axios({ method: "GET", url: signalRepeator  })
       .then((response) => {
          const data = response.data;
          console.log('=====>', response);
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
             $("#table_det thead").append(
                "<tr>" +
                "<th>SNO</th>" +
                "<th>MAC ID </th>" +
                "<th>LAST SEEN</th>" +
                " <th>STATUS</th>" +
                "</tr>"
             );
             for (let i = 0; i < data.length; i++) {
                let status = 'red';
                if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                   status = "green";
                }
                $("#table_det tbody").append(
                   "<tr class=row_" + (i + 1) + ">" +
                   "<td>" + (i + 1) + "</td>" +
                   "<td>" + data[i].macid + "</td>" +
                   "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                   "<td><div class='circle' style='margin:auto;background-color:" +
                   status +
                   ";'></div></td> " +
                   "</tr>"
                )
             }
             if (data.length > 25) {
                $(".pagination").show();
                $("#rangeDropdown").show();
                getPagination(this, "#table_det");
             }
             this.setState({ loading: false });
          } else {
             this.setState({ message: "No SignalRepeator Data Found!", error: true, loading: false });
          }
       })
       .catch((error) => {
          console.log('Health signalRepeator Gate Error====', error);
          this.setState({ loading: false });
          if (error.response.status === 403) {
             $("#displayModal").css("display", "block");
             $("#content").text("User Session has timed out. Please Login again.");
          }else  if (error.response.status === 404) {
            this.setState({error:true,message:'No Signal Repeater Data Found'})
            $("#table_det thead").empty();
            $("#table_det tbody").empty();
         }
       })
 }
 };
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  render() {
    const { loading,error,message } = this.state;
    return (
      <Fragment>
        <>
          <title>System Health</title>
        </>
        <div className="panel">
          <span className="main-heading">SYSTEM HEALTH</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
          
          <div style={{marginBottom:'30px'}}>
          <div className="inputdiv" style={{ marginTop: "20px" }}>
          <span className="label">Health:</span>
          <select
             name="healthtype"
             id="healthtype"
             required="required"
             onChange={() => {
                clearInterval(this.interval)
                this.componentDidMount()
             }}>
             <option>Master</option>
             <option>Slave</option>
             <option>Assets</option>
             <option>Sensors</option>
             <option>Signal Repeaters</option>
          </select>
       </div>
       </div>
        {error && (
          <div style={{ color: "red", marginTop: "20px" }}>
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
      </Fragment>
    );
  }
}

export default SystemHealth;

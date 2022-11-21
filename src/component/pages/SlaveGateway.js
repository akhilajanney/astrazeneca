import React, { Component, Fragment } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";
import { masterGateway, slaveGateway } from "../../urls/apis";

class SlaveGateway extends Component {
  componentDidMount() {
    axios({
      method: "GET",
      url: masterGateway,
    })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          this.fdata = response.data;
          if (this.fdata.length !== 0) {
            for (let i = 0; i < this.fdata.length; i++) {
              $("#mastergatewayid").append(
                "<option>" + this.fdata[i].gatewayid + "</option>"
              );
            }
          } else {
            $("#slave-error").text(
              "Please Register Master Gateway to Register Slave Gateway."
            );
          }
        } else {
          $("#slave-error").text("Unable to get Gateway ID");
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has Timed Out. Please Login Again");
        } else if (error.response.status === 404) {
          $("#slave-error").text("No Master Gateway Registered.");
        } else {
          $("#slave-error").text(
            "Request Failed with status code (" + error.response.status + ")."
          );
        }
      });
  }

  show = () => {
    $("#slaveid").val("");
    $("input[type='text']").val("");
    document.getElementById("slave-del-form").style.display =
      $("#slave-del-form").css("display") === "block" ? "none" : "block";
  };

  hide = () => {
    $("#slave-error").text("");
    $("#slave-success").text("");
  };

  registerSlave = (e) => {
    this.hide();
    $("#slave-del-form").css("display", "none");
    e.preventDefault();
    let slave = $("#slaveid").val();
    if (slave.length === 0) {
      $("#slave-error").text("Please Enter Slave-Gateway ID.");
    } else if (!slave.match("([A-Za-z0-9]{2}[-]){5}([A-Za-z0-9]){2}")) {
      $("#slave-error").text("Invalid Slave-Gateway ID Entered.");
    } else {
      let gateway = $("#mastergatewayid").val();

      axios({
        method: "POST",
        url: slaveGateway,
        data: { master: gateway, macaddress: slave },
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            $("#slave-success").text("Slave Gateway Registered Successfully.");
            $("#slaveid").val("");
          } else {
            $("#slave-error").text("Unable to Registered Slave Gateway.");
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again"
            );
          } else {
            $("#slave-error").text(
              "Request Failed with status code (" + error.response.status + ")."
            );
          }
        });
    }
  };

  unregisterSlave = (e) => {
    this.hide();
    e.preventDefault();
    let id = $("#slaveid-del").val();
    if (id.length === 0) {
      $("#slave-error").text("Please Enter Slave-Gateway ID for Deletion.");
    } else if (!id.match("([A-Za-z0-9]{2}[-]){5}([A-Za-z0-9]){2}")) {
      $("#slave-error").text("Invalid Slave-Gateway ID Entered.");
    } else {
      axios({
        method: "DELETE",
        url: slaveGateway,
        data: { macaddress: id },
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            $("#slave-success").text(
              "Slave Gateway Un-Registered Successfully."
            );
            $("#slaveid-del").val("");
            this.show();
          } else {
            $("#slave-error").text("Unable to Un-Registered Slave Gateway.");
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again"
            );
          } else {
            $("#slave-error").text(
              "Request Failed with status code (" + error.response.status + ")."
            );
          }
        });
    }
  };

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLoginError();
  };

  render() {
    return (
      <Fragment>
        <span className="sub-heading">Slave Gateway Registration</span>
        <br />
        <img
          src="../images/Tiles/Underline.png"
          alt=""
          style={{
            width: "56px",
            height: "3px",
            marginTop: "2px",
            position: "absolute",
          }}
        />
        <br></br>
        <div>
          <strong>
            <span className="error-msg" id="slave-error"></span>
          </strong>
          <strong>
            <span className="success-msg" id="slave-success"></span>
          </strong>
        </div>
        <form id="slave-reg-form">
          <div className="input-group">
            <span className="label">Master Gateway ID :</span>
            <select id="mastergatewayid"></select>
          </div>
          <div className="input-group">
            <span className="label">Gateway ID :</span>
            <input
              type="text"
              name="slaveid"
              id="slaveid"
              required="required"
              placeholder="5a-c2-15-00-00-00"
              onChange={this.hide}
            />
          </div>
        </form>
        <div style={{ display: "flex", margin: "15px" }}>
        <input
        style={{ background:'#eb6565' }}
        type="button"
        onClick={() => {
          this.show();
          this.hide();
        }}
        value="Remove Gateway"
        className="btn success-btn"
      />
          <input style={{marginLeft: "40px",}}
            type="submit"
            onClick={this.registerSlave}
            value="Register Gateway"
            className="btn success-btn"
          />
       
        </div>
        <form
          id="slave-del-form"
          className="fading"
          style={{ display: "none" }}
        >
          <div className="input-group">
            <span className="label">Gateway MAC ID :</span>
            <input
              type="text"
              name="slaveid-del"
              id="slaveid-del"
              required="required"
              onClick={this.hide}
              placeholder="5a-c2-15-00-00-00"
            />
          </div>
          <div className="input-group" style={{ margin: "15px" }}>
            <input style={{background:'#eb6565'}}
              type="submit"
              value="Delete Gateway"
              onClick={this.unregisterSlave}
              className="btn success-btn"
            />
          </div>
        </form>
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
      </Fragment>
    );
  }
}

export default SlaveGateway;

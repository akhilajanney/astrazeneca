import React, { Component, Fragment } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";
import { employeeRegistration } from "../../urls/apis";
import { Helmet } from "react-helmet";

// Styling property for Underline Image
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

class EmployeeRegistration extends Component {
  /** Displays Delete tag form on clicking Delete Tag Button */
  show = () => {
    $("input[type=text]").val("");
    $("input[type=email]").val("");
    document.getElementById("delete-form").style.display =
      document.getElementById("delete-form").style.display === "none"
        ? "block"
        : "none";
    window.scrollTo(0, document.body.scrollHeight);
  };

  /** Hides all error and success messages displayed on all button clicks */
  hide = () => {
    document.getElementById("conf-error").innerHTML = "";
    document.getElementById("conf-success").innerHTML = "";
  };

  /** Register the both sensor and tracking tags */
  register = (e) => {
    this.hide();
    e.preventDefault();
    $("#delete-form").css("display", "none");
    let data = {
      empname: $("#empname").val(),
      empid: $("#empid").val(),
      mailid: $("#mailid").val(),
      phoneno: $("#phoneno").val(),
      address: $("#address").val(),
    };

    if (
      data.empname.length !== 0 &&
      data.empid.length !== 0 &&
      data.mailid.length !== 0 &&
      data.phoneno.length !== 0 &&
      data.address.length !== 0
    ) {
      if (data.phoneno.length !== 10 || !data.phoneno.match("[789][0-9]{9}")) {
        $("#conf-error").text("Invalid phone number given.");
      } else {
        axios({
          method: "POST",
          url: employeeRegistration,
          data: data,
        })
          .then((response) => {
            console.log("======",response);
            if (response.status === 201) {
              $("#conf-success").text("Employee is registered successfully.");
            } else {
              $("#conf-error").text("Unable to register employee.");
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
              $("#displayModal").css("display", "block");
              $("#content").text(
                "User Session has timed out. Please Login again."
              );
            } else {
              $("#conf-error").text(
                "Request Failed with status code (" +
                  error.response.status +
                  ")."
              );
            }
          });
      }
    } else {
      $("#conf-error").text("Please provide all information.");
    }
    // !data.emailid.match(
    //   "^[a-zA-Z][a-zA-Z0-9_.-]+@[a-zA-Z0-9]+[.]{1}[a-zA-Z]+$"
    // )
    $("input[type=text]").val("");
    $("input[type=email]").val("");
    $("input[type=tel]").val("");
  };

  /** Unregister the registered tags */
  unregister = (e) => {
    this.hide();
    e.preventDefault();
    let id = $("#macid").val();
    if (id.length === 0)
      $("#conf-error").text("Please Enter MAC ID to Un-registered.");
    else {
      axios({
        method: "DELETE",
        url: employeeRegistration,
        data: { empid: id },
      })
        .then((response) => {
          if (response.status === 200) {
            $("#conf-success").text("Tag un-registered successfully.");
          } else {
            $("#conf-error").text("Unable to un-registered Tag.");
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has timed out. Please Login again"
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" + error.response.status + ")."
            );
          }
        });
    }
    $("input[type=text]").val("");
    $("input[type=email]").val("");
  };

  /** Terminate the session on forbidden (403) error */
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLoginError();
  };

  render() {
    return (
      <Fragment>
        <>
          <title>Employee Registration</title>
        </>
        <div className="panel">
          <span className="main-heading">Employee Registration</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />
          <div className="container fading" style={{ marginTop: "50px" }}></div>
          <div>
            {/* Element for displaying error messages */}
            <span className="error-msg" id="conf-error"></span>
            <span className="success-msg" id="conf-success"></span>
          </div>
          {/* Form for Registering the sensor and tracking tags */}
          <form id="reg-form">
            {/* Input field for Floor Name */}
            <div className="input-group">
              <span className="label">Employee Name : </span>
              <input type="text" id="empname" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Employee ID : </span>
              <input type="text" id="empid" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Mail ID : </span>
              <input type="email" id="mailid" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Phone Number : </span>
              <input
                type="tel"
                id="phoneno"
                minLength="10"
                maxLength="10"
                pattern="[789][0-9]{9}"
                title="Phone number must start with 7-9 and remaining 9 digit with 0-9"
                srequired="required"
              />
            </div>
            <div className="input-group">
              <span className="label">Address : </span>
              <input type="text" id="address" required="required" />
            </div>
            <div className="input-group">
              <input
                type="submit"
                value="Add Employee"
                onClick={this.register}
                className="btn success-btn"
              />
            </div>
          </form>
          {/* Button for toggeling for Deleting Tag Form */}
          <button
            onClick={() => {
              this.show();
              this.hide();
            }}
            className="btn success-btn"
          >
            Delete Employee
          </button>
          {/* Form for deleting the registered tags */}
          <form id="delete-form" className="fading" style={{ display: "none" }}>
            {/* Input Field for Tag MAC ID */}
            <div className="input-group">
              <span className="label">Employee ID :</span>
              <input
                type="text"
                name="macid"
                id="macid"
                required="required"
                onClick={this.hide}
                placeholder="5a-c2-15-00-00-00"
              />
            </div>

            <div className="input-group">
              <input
                type="submit"
                value="Delete Tag"
                onClick={this.unregister}
                className="btn success-btn"
              />
            </div>
          </form>
        </div>

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

export default EmployeeRegistration;

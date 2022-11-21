import React, { Component, Fragment } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";
import {
  employeeRegistration,
  floorMap,
  irqSensor,
  signalRepeator,
  tempertureSensor,
} from "../../urls/apis";
import * as XLSX from "xlsx";

class AssetReg extends Component {
  componentDidMount = () => {
    axios({
      method: "GET",
      url: floorMap,
    })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          this.fdata = response.data;
          if (this.fdata.length !== 0) {
            for (let i = 0; i < this.fdata.length; i++) {
              $("#fname").append(
                "<option value=" +
                  this.fdata[i].id +
                  ">" +
                  this.fdata[i].name +
                  "</option>"
              );
              $("#fname1").append(
                "<option value=" +
                  this.fdata[i].id +
                  ">" +
                  this.fdata[i].name +
                  "</option>"
              );
            }
          } else {
            $("#master-error").text(
              "Please Upload Floormap to Register Master Gateway."
            );
          }
        } else {
          $("#master-error").text("Unable to Fetch Floor Names");
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
          $("#content").text("User Session has Timed Out. Please Login Again.");
        } else {
          $("#master-error").text(
            "Request Failed with status code (" + error.response.status + ")."
          );
        }
      });
  };

  displayTrackingForm = () => {
    let type = $("#type").val();
    this.setState({ type: type });
    if (type === "Temperature/Humidity Sensor") {
      $("#temp_form").css("display", "block");
      $("#bluk_reg").css("display", "none");
    } else $("#temp_form").css("display", "none");

    if (type === "IAQ Sensor") {
      $("#iaq_form").css("display", "block");
      $("#bluk_reg").css("display", "none");
    } else $("#iaq_form").css("display", "none");

    if (type === "Signal Repeater") {
      $("#bluk_reg").css("display", "none");
    }

    if (type === "Employee") {
      $("#emp_form").css("display", "block");
      $("#bluk_reg").css("display", "block");
    } else {
      $("#emp_form").css("display", "none");
    }
  };

  show = () => {
    $("input[type=text]").val("");
    $("input[type=email]").val("");
    $("#bluk_form").css("display", "none");

    document.getElementById("delete-form").style.display =
      $("#delete-form").css("display") === "none" ? "block" : "none";
    window.scrollTo(0, document.body.scrollHeight);
  };

  hide = () => {
    $("#conf-error").text("");
    $("#conf-success").text("");
  };

  register = (e) => {
    this.hide();
    e.preventDefault();
    $("#delete-form").css("display", "none");
    let data = {};
    if ($("#tagid").val().length === 0) {
      $("#conf-error").text("Please Enter Tag MAC ID.");
    } else if (
      !$("#tagid").val().match("([A-Za-z0-9]{2}[-]){5}([A-Za-z0-9]){2}")
    ) {
      $("#conf-error").text(
        "Invalid MAC ID Entered. Please Enter Proper MAC ID."
      );
    } else if ($("#type").val() === "Temperature/Humidity Sensor") {
      data = {
        macaddress: $("#tagid").val(),
        x1: $("#x").val(),
        y1: $("#y").val(),
        x2: $("#x1").val(),
        y2: $("#y1").val(),
        id: $("#fname").val(),
      };
      if (
        data.x1 !== "" &&
        data.y1 !== "" &&
        data.x2 !== "" &&
        data.y2 !== "" &&
        data.id !== ""
      ) {
        axios({
          method: "POST",
          url: tempertureSensor,
          data: data,
        })
          .then((response) => {
            console.log("======>", response);
            if (response.status === 201) {
              $("#conf-success").text(
                "Temperature-Humidity Sensor is Registered Successfully."
              );
            } else {
              $("#conf-error").text(response.data.message);
            }
          })
          .catch((error) => {
            if (error.response.status === 403) {
              $("#displayModal").css("display", "block");
              $("#content").text(
                "User Session has Timed Out. Please Login Again."
              );
            } else if (error.response.status === 400) {
              $("#conf-error").text("Tag is Already Registered.");
            } else {
              $("#conf-error").text(
                "Request Failed with status code (" +
                  error.response.status +
                  ")."
              );
            }
          });
      } else {
        $("#conf-error").text("Please Provide All Information.");
      }
    } else if ($("#type").val() === "IAQ Sensor") {
      data = {
        macaddress: $("#tagid").val(),
        x: $("#xval").val(),
        y: $("#yval").val(),
        id: $("#fname1").val(),
      };
      if (data.x !== "" && data.y !== "" && data.id !== "") {
        axios({
          method: "POST",
          url: irqSensor,
          data: data,
        })
          .then((response) => {
            console.log("======>", response);
            if (response.status === 201) {
              $("#conf-success").text("IAQ Sensor Registered Successfully.");
            } else {
              $("#conf-error").text(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
              $("#displayModal").css("display", "block");
              $("#content").text(
                "User Session has Timed Out. Please Login again."
              );
            } else if (error.response.status === 400) {
              $("#conf-error").text("Tag is Already Registered.");
            } else {
              $("#conf-error").text(
                "Request Failed with status code (" +
                  error.response.status +
                  ")."
              );
            }
          });
      } else {
        $("#conf-error").text("Please Provide All Information.");
      }
    } else if ($("#type").val() === "Employee") {
      data = {
        tagid: $("#tagid").val(),
        name: $("#emp_name").val(),
        role: $("#emp_role").val(),
        email: $("#emp_email").val(),
        empid: $("#emp_id").val(),
        phone: $("#emp_phoneNo").val(),
      };
      console.log("Employee========>", data);
      if (
        data.tagid.length !== 0 &&
        data.name.length !== 0 &&
        data.role.length !== 0
      ) {
        axios({
          method: "POST",
          url: employeeRegistration,
          data: data,
        })
          .then((response) => {
            console.log("------->", response);
            if (response.status === 201 || response.status === 200) {
              $("#conf-success").text("Employee Tag Registered Successfully.");
            } else {
              $("#conf-error").text(response.data.message);
            }
          })
          .catch((error) => {
            if (error.response.status === 403) {
              $("#displayModal").css("display", "block");
              $("#content").text(
                "User Session has timed out. Please Login again."
              );
            } else if (error.response.status === 400) {
              $("#conf-error").text("Employee Tag is Already Registered.");
            } else {
              $("#conf-error").text(
                "Request Failed with status code (" +
                  error.response.status +
                  ") : Employee Tag"
              );
            }
          });
      } else {
        $("#conf-error").text("Please Provide All Information.");
      }
    } else {
      data = {
        macaddress: $("#tagid").val(),
      };
      axios({
        method: "POST",
        url: signalRepeator,
        data: data,
      })
        .then((response) => {
          if (response.status === 201 || response.status === 200) {
            console.log("======>", response);
            $("#conf-success").text(
              "Signal Repeater Registered Successfully."
            );
          } else {
            $("#conf-error").text(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again."
            );
          } else if (error.response.status === 400) {
            $("#conf-error").text("Signal Repeater Already Registered.");
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" +
                error.response.status +
                ") : Employee Tag"
            );
          }
        });
    }

    // $("input[type=text]").val("");
    // $("input[type=email]").val("");
    // $("input[type=number]").val("");
  };

  unregister = (e) => {
    this.hide();
    e.preventDefault();
    let id = $("#macid").val();
    if (id.length === 0)
      $("#conf-error").text("Please Enter MAC ID.");
    else if (!id.match("([A-Za-z0-9]{2}[-]){5}([A-Za-z0-9]){2}"))
      $("#conf-error").text("Invalid MAC ID Entered.");
    else if ($("#tagtype").val() === "Temperature/Humidity Sensor") {
      axios({
        method: "DELETE",
        url: tempertureSensor,
        data: { macaddress: id },
      })
        .then((response) => {
          if (response.status === 200) {
            $("#delete-form").css("display", "none");
            $("#conf-success").text("Tag Un-Registered Successfully.");
          } else {
            $("#conf-error").text(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again"
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" + error.response.status + ")."
            );
          }
        });
    } else if ($("#tagtype").val() === "IAQ Sensor") {
      axios({
        method: "DELETE",
        url: irqSensor,
        data: { macaddress: id },
      })
        .then((response) => {
          if (response.status === 200) {
            $("#delete-form").css("display", "none");
            $("#conf-success").text("Tag Un-Registered successfully.");
          } else {
            $("#conf-error").text(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again"
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" + error.response.status + ")."
            );
          }
        });
    } else if ($("#tagtype").val() === "Signal Repeater") {
      // console.log(id);
      axios({
        method: "DELETE",
        url: signalRepeator,
        data: { macaddress: id },
      })
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            $("#delete-form").css("display", "none");
            $("#conf-success").text(
              "Signal Repeater Asset Deleted Successfully."
            );
          } else {
            $("#conf-error").text(response.data.message);
          }
        })
        .catch((error) => {
          // console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again."
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" +
                error.response.status +
                ") : Employee Tag"
            );
          }
        });
    } else if ($("#tagtype").val() === "Employee") {
      axios({
        method: "DELETE",
        url: employeeRegistration,
        data: { tagid: id },
      })
        .then((response) => {
          if (response.status === 200) {
            $("#delete-form").css("display", "none");
            $("#conf-success").text("Employee Tag Deleted Successfully.");
          } else {
            $("#conf-error").text(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again."
            );
          } else {
            $("#conf-error").text(
              "Request Failed with Status Code (" +
                error.response.status +
                ") : Employee Tag"
            );
          }
        });
    }
    $("input[type=text]").val("");
    $("input[type=email]").val("");
  };

  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLoginError();
  };

  excelToJson(reader) {
    var fileData = reader.result;
    var wb = XLSX.read(fileData, { type: "binary" });
    var data = {};
    var data1 = [];
    wb.SheetNames.forEach(function (sheetName) {
      var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
      var rowString = JSON.stringify(rowObj);
      data[sheetName] = rowString;
      data1 = rowObj;
    });
    // console.log("============>", data1);

    this.setState({ excelData: data1 });
  }
  loadFileXLSX(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = this.excelToJson.bind(this, reader);
    reader.readAsBinaryString(input.files[0]);
  }

  bulkRegister = (e) => {
    e.preventDefault();
    $("#conf-error").text("");
    $("#conf-success").text("");
    $("#bulk_file").val("");
    console.log("bulkRegister=======>", this.state.excelData);
    if (this.state.excelData === undefined || this.state.excelData === null) {
      $("#conf-error").text("No File Found.");
    } else if (this.state.excelData.length > 0) {
      axios({
        method: "POST",
        url: "/api/employee/bulk/registration",
        data: this.state.excelData,
      })
        .then((res) => {
          console.log("RESPONSE======>", res);
          if (res.status === 200 || res.status === 201) {
            $("#bulk_file").val("");
            $("#conf-success").text("Bulk Registered Successfully.");
          } else if (res.status === 208) {
            $("#conf-error").text(res.data.error);
          } else {
            $("#conf-error").text("Unable to Register.");
          }
        })
        .catch((error) => {
          console.log("ERROR=====>", error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again."
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" + error.response.status + ")"
            );
          }
        });
    }
  };

  bulkUpdate = (e) => {
    e.preventDefault();
    $("#conf-error").text("");
    $("#conf-success").text("");
    $("#bulk_file").val("");
    console.log("bulkUpdate==========>", this.state.excelData);
    if (this.state.excelData === undefined || this.state.excelData === null) {
      $("#conf-error").text("No File Found.");
    } else if (this.state.excelData.length > 0) {
      axios({
        method: "PATCH",
        url: "/api/employee/bulk/registration",
        data: this.state.excelData,
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            console.log("RESPONSE======>", res);
            $("#bulk_file").val("");
            $("#conf-success").text("Bulk Update Successfully.");
          } else if (res.status === 208) {
            $("#conf-error").text(res.data.error);
          } else {
            $("#conf-error").text("Unable to Update.");
          }
        })
        .catch((error) => {
          console.log("ERROR=====>", error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text(
              "User Session has Timed Out. Please Login Again."
            );
          } else {
            $("#conf-error").text(
              "Request Failed with status code (" + error.response.status + ")"
            );
          }
        });
    }
  };

  render() {
    return (
      <Fragment>
        <span className="sub-heading">Asset Registration</span>
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
            <span className="error-msg" id="conf-error"></span>
          </strong>
          <strong>
            <span className="success-msg" id="conf-success"></span>
          </strong>
        </div>
        <form id="reg-form">
          <div className="input-group">
            <span className="label">Tag MAC ID :</span>
            <input
              type="text"
              id="tagid"
              required="required"
              onClick={this.hide}
              placeholder="5a-c2-15-00-00-00"
            />
          </div>
          <div className="input-group">
            <span className="label">Tag Type :</span>
            <select
              id="type"
              onChange={() => {
                this.displayTrackingForm();
                this.hide();
              }}
            >
              <option>Temperature/Humidity Sensor</option>
              <option>IAQ Sensor</option>
              <option>Signal Repeater</option>
              <option>Employee</option>
            </select>
          </div>
          <div id="temp_form" className="fading" style={{ display: "block" }}>
            <div className="input-group">
              <span className="label">Floor Name : </span>
              <select name="type" id="fname"></select>
            </div>
            <div className="input-group">
              <span className="label">X Co-ordinate : </span>
              <input type="number" id="x" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Y Co-ordinate : </span>
              <input type="number" id="y" required="required" />
            </div>
            <div className="input-group">
              <span className="label">X1 Co-ordinate : </span>
              <input type="number" id="x1" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Y1 Co-ordinate : </span>
              <input type="number" id="y1" required="required" />
            </div>
          </div>
          <div id="iaq_form" className="fading" style={{ display: "none" }}>
            <div className="input-group">
              <span className="label">Floor Name : </span>
              <select name="type" id="fname1"></select>
            </div>
            <div className="input-group">
              <span className="label">X Co-ordinate : </span>
              <input type="number" id="xval" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Y Co-ordinate : </span>
              <input type="number" id="yval" required="required" />
            </div>
          </div>

          <div id="emp_form" className="fading" style={{ display: "none" }}>
            <div className="input-group">
              <span className="label">Name : </span>
              <input type="text" id="emp_name" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Role : </span>
              <input type="text" id="emp_role" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Employee ID : </span>
              <input type="text" id="emp_id" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Email : </span>
              <input type="text" id="emp_email" required="required" />
            </div>
            <div className="input-group">
              <span className="label">Phone.No : </span>
              <input type="text" id="emp_phoneNo" required="required" />
            </div>
          </div>

          {/* Button for searching tag */}
          <div style={{ display: "flex", margin: "15px" }}>
          <input
              style={{ marginLeft: "40px",background:'#eb6565'}}
              type="button"
              onClick={() => {
                this.show();
                this.hide();
              }}
            value="Remove Tag"
             className="btn success-btn"
        />
            <input  style={{ marginLeft: "40px"}}
              type="submit"
              onClick={this.register}
              value="Register Tag"
              className="btn success-btn"
            />
           

            <input
              id="bluk_reg"
              style={{ marginLeft: "20px", display: "none" }}
              type="button"
              onClick={() => {
                $("#delete-form").css("display", "none");
                $("#bluk_form").css(
                  "display",
                  $("#bluk_form").css("display") === "block" ? "none" : "block"
                );
                window.scrollTo(0, document.body.scrollHeight);
              }}
              value="Bulk Upload"
              className="btn success-btn"
            />
          </div>
        </form>

        <form id="bluk_form" className="fading" style={{ display: "none" }}>
          <div className="input-group">
            <span className="label">Employee Bulk Upload :</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              required="required"
              onChange={this.loadFileXLSX.bind(this)}
              name="bulk_file"
              id="bulk_file"
            />
          </div>
          <div style={{ display: "flex", margin: "15px" }}>
            <div className="input-group">
              <input
                type="submit"
                value="Bulk Register"
                onClick={this.bulkRegister}
                className="btn success-btn"
              />

              <input
                style={{ marginLeft: "20px" }}
                type="submit"
                value="Bulk Update"
                onClick={this.bulkUpdate}
                className="btn update-btn"
              />
            </div>
          </div>
        </form>

        <form id="delete-form" className="fading" style={{ display: "none" }}>
          <div className="input-group">
            <span className="label">Tag Type :</span>
            <select
              id="tagtype"
              onChange={() => {
                this.displayTrackingForm();
                this.hide();
              }}
            >
              <option>Temperature/Humidity Sensor</option>
              <option>IAQ Sensor</option>
              <option>Signal Repeater</option>
              <option>Employee</option>
            </select>
          </div>

          {/* Input Field for Tag MAC ID */}
          <div className="input-group">
            <span className="label">Tag MAC ID :</span>
            <input
              type="text"
              name="macid"
              id="macid"
              required="required"
              onClick={this.hide}
              placeholder="5a-c2-15-00-00-00"
            />
          </div>

          <div className="input-group" style={{ margin: "15px" }}>
            <input
              type="submit"
              value="Delete Tag"
              onClick={this.unregister}
              className="btn warning-btn"
            />
          </div>
        </form>

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

export default AssetReg;

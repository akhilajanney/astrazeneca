import React, { Component, Fragment } from "react";
import "./Login.css";
import "../pages/Styling.css";
import axios from "axios";
import { loginAPI } from "../../urls/apis";

class Login extends Component {
  // Defining states of component
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  /** Method to show and hide password */
  toggle = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  /** Method to change state of component on entering data */
  handleChanges = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /** Method to login */
  login = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: loginAPI,
      data: this.state,
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          sessionStorage.setItem("isLoggedIn", 1);
          this.props.handleLogin(1);
        }
      })
      .catch((error) => {
        document.getElementById("err").innerHTML = "Request Failed.";
      });
  };

  /** Redern the html content on the browser */
  render() {
    const { username, password } = this.state;
    return (
      <Fragment>
        <>
          <title>Login</title>
        </>
        <div className="main-div">
          <div className="div-section fading">
            <div
              style={{
                backgroundColor: "rgb(153, 204, 204, 40%)",
                borderRadius: "8px",
                width: "90%",
                padding: "10%",
                boxShadow:
                  "12px 12px 16px 0 rgba(0, 0, 0, 0.25), -12px -12px 16px 0 rgba(0, 0, 0, 0.03)",
              }}
            >
              <img
                src="../images/Tiles/astralogo.png"
                alt=""
                style={{
                  width: "85%",
                  margin: "-10% -7% 8%",
                  display: "block",
                }}
              />
              <img
                src="../images/Tiles/Login.png"
                alt=""
                style={{
                  width: "35%",
                  height: "13%",
                  marginBottom: "10%",
                  display: "block",
                }}
              />
              {/* Login Form */}
              <form>
                {/* Input field for username */}
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required="required"
                    value={username}
                    style={{ width: "100%", height: "5.5vh" }}
                    onChange={this.handleChanges}
                  />
                </div>
                {/* Input field for password */}
                <div className="input-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required="required"
                    autoComplete="off"
                    value={password}
                    style={{ width: "100%", height: "5.5vh" }}
                    onChange={this.handleChanges}
                  />
                </div>
                {/* check box to toggle password */}
                <div className="input-group">
                  <input
                    type="checkbox"
                    title="Show password"
                    onClick={this.toggle}
                  />
                  <span style={{ fontSize: "15px", color: "gray" }}>
                    Show Password
                  </span>
                </div>
                {/* Button to login */}
                <div className="input-group">
                  <button
                    className="btn success-btn"
                    onClick={this.login}
                    style={{ width: "100%", height: "5.9vh" }}
                  >
                    LOGIN
                  </button>
                </div>
                <span className="error-msg" id="err"></span>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Login;

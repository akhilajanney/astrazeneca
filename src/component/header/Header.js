import React, { Component, Fragment } from "react";
import "./Header.css";
import axios from "axios";
import { logoutAPI } from "../../urls/apis";

const Logo = {
  opacity: "0.6",
  width: "35px",
  float: "right",
  marginRight: "30px",
  cursor: "pointer",
};

class Header extends Component {
  logout = () => {
    axios({
      method: "GET",
      url: logoutAPI,
    })
      .then((response) => {
        sessionStorage.clear("isLoggedIn");
        this.props.handleLogin(0);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          sessionStorage.setItem("isLoggedIn", 0);
          this.props.handleLogin(0);
        }
      });
  };
  logoClick = () => {
    window.location.pathname = "/home"
  }

  render() {
    return (
      <Fragment>
        <div className="navbar">
          <div>
            <img alt=""
              style={{cursor:"pointer"}}
              src="../images/Tiles/astralogo.png"
              onClick={this.logoClick} />
            <img
              alt=""
              src="../images/Icons/Icon_Logout.png"
              style={Logo}
              title="Logout"
              onClick={this.logout}
              className="logoutImg"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Header;

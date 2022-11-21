import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Margin = { margin: "40px 0px" };
const Background = { backgroundColor: "rgba(2,167,140,0.2)" };

export function linkClicked(id) {
  let element = document.getElementsByClassName("linkImg");
  element[0].style.backgroundColor = "";
  element[1].style.backgroundColor = "";
  element[2].style.backgroundColor = "";
  element[3].style.backgroundColor = "";
  element[4].style.backgroundColor = "";
  element[id].style.backgroundColor = "rgba(2,167,140,0.2)";
}

function Navbar() {
  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/home">
          <div style={Margin}>
            <img
              alt=""
              src="../images/Icons/Icon_Home.png"
              title="Home"
              onClick={() => linkClicked(0)}
              className={"linkImg"}
              style={Background}
            />
          </div>
        </Link>
        <Link to="/tracking">
          <div>
            <img
              alt=""
              src="../images/Icons/Icon_Tracking.png"
              title="Realtime Tracking"
              onClick={() => linkClicked(1)}
              className={"linkImg"}
            />
          </div>
        </Link>
        {/* <Link to="/distanceTracking">
          <div>
            <img
              alt=""
              src="../images/Icons/ContactTracing.png"
              title="Contact Tracing"
              onClick={() => linkClicked(2)}
              className={"linkImg"}
            />
          </div>
        </Link>
        <Link to="/dailyreport">
          <div>
            <img
              alt=""
              src="../images/Icons/Icon_Reports.png"
              title="Reports"
              onClick={() => linkClicked(3)}
              className={"linkImg"}
            />
          </div>
        </Link> */}

        <Link to="/thermalmap">
          <div>
            <img
              alt=""
              src="../images/Icons/Icon_Temperature.png"
              title="Thermal Environment"
              onClick={() => linkClicked(2)}
              className={"linkImg"}
            />
          </div>
        </Link>
        <Link to="/airquality">
          <div>
            <img
              alt=""
              src="../images/Icons/AirQualityIcon.png"
              title="Air Quality Parameters"
              onClick={() => linkClicked(3)}
              className={"linkImg"}
            />
          </div>
        </Link>
        <Link to="/alerts">
          <div>
            <img
              alt=""
              src="../images/Icons/Icon_Alerts.png"
              title="Alerts"
              onClick={() => linkClicked(4)}
              className={"linkImg"}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;

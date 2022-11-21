import React, { Fragment, PureComponent } from "react";

class BulkUpload extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className="col  colorBlock">
          {/* Bulk uploading of Tracking Tags */}
          <div className="input-group">
            <span className="sub-heading">Tracking Tags : </span>
            <input type="file" id="fileUpload" name="fileUpload" />
            <input
              type="button"
              id="upload"
              className="btn success-btn"
              value="Upload File"
              onClick={this.uploadFile}
              style={{ height: "40px", marginLeft: "10px" }}
            />
            <div style={{ marginLeft: "40%", marginTop: "10px" }}>
              <a href="../templates/tracking_template.xlsx" download>
                <img
                  alt=""
                  src="../images/Icons/Icon_Download.png"
                  style={{
                    width: "15px",
                    height: "15px",
                    marginRight: "10px",
                  }}
                />
                Sample Excel Sheet
              </a>
            </div>
          </div>
        </div>
        <div className="col colorBlock">
          {/* Bulk uploading of Sensor Tags */}
          <div className="input-group">
            <span className="sub-heading">Sensor Tags : </span>
            <input type="file" id="fileUpload" name="fileUpload" />
            <input
              type="button"
              id="upload"
              className="btn success-btn"
              value="Upload File"
              onClick={this.uploadFile}
              style={{ height: "40px", marginLeft: "10px" }}
            />
            <div style={{ marginLeft: "40%", marginTop: "10px" }}>
              <a href="../templates/sensor_template.xlsx" download>
                <img
                  alt=""
                  src="../images/Icons/Icon_Download.png"
                  style={{
                    width: "15px",
                    height: "15px",
                    marginRight: "10px",
                  }}
                />
                Sample Excel Sheet
              </a>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default BulkUpload;

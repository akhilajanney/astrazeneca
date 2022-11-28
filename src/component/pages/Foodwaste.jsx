import React, { Component } from 'react'
// import './style.css'
import axios from 'axios'
import 'animate.css';
import $ from "jquery";
import { getPagination, TableDetails, DataLoading } from './common'

const Underline = {
    width: "85px",
    height: "9px",
    position: "absolute",
  };

export default class Foodwaste extends Component {
    constructor() {
        super();
        this.state = {
          loading: false,
          error: false,
          message: '',
           wastage: 0,
            price: 0,
            people: 0,

        };
      }
      componentDidMount() {
        this.interval = setInterval(() => {
            this.wastage()
        }, 2000);
    }
    wastage = () => {
      axios({ method: 'GET', url: '/api/sensor/report' })
          .then((response) => {
              console.log(response)
              let data = response.data;
              console.log(data, '-----------')
              if (response.status === 200 && data.length !== 0) {
                  let waste = data.reading.toFixed(2);
                  let cost = (waste * 80).toFixed(0);
                  // let people = (waste * 2).toFixed(0);
                  let people = (cost/50).toFixed(0);

                  this.setState({ wastage: waste, price: cost, people: people })
              }
              else {
                  this.setState({ wastage: 0, price: 0, people: 0 })
              }

          })
          .catch((error) => {
              console.log("error===>", error)
              this.setState({ wastage: 0, price: 0, people: 0 })
              if (error.response.status === 403) {
                $("#displayModal").css("display", "block");
                $("#content").text("User Session has Timed Out. Please Login Again");
              }
          })
  }
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  componentWillUnmount() {
      clearInterval(this.interval)
  }
  render() {
    const{loading,message,error,wastage, price, people }=this.state;
    return (
      <div className="panel"
      style={{
        height: loading === true ? "600px" : "auto",
        overflow: loading === true ? "hidden" : "none",
      }}>
      <span className="main-heading">FOOD WASTAGE</span>
      <br />
      <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

      <div style={{display:'flex'}}>
        <div className='summarycard'>
            <span
             style={{fontWeight:600,color:"#434343",display:'block',textAlign:'center', fontSize:'35px',
             paddingTop:'20px'}}>
             Summary</span>

             <div className='subdiv2'>

             <p style={{ marginTop: '6px'}}> Food wastage for today is
                 <div className='textfield'><span className="animate__animated animate__heartBeat animate__infinite" id='values'>{wastage}</span></div> kg
             </p>

             <p>
                 Cost of food waste for
                 <div className='textfield'><span className="animate__animated animate__pulse animate__infinite" id='values'>{wastage}</span></div>
                 kg is Rs<span style={{ fontSize: '30px', fontFamily: "ui-serif" }}>(₹)</span> <div className='textfield'>
                     <span className="animate__animated animate__pulse animate__infinite" id='values'>{price}</span></div>
             </p>

             <p>
                 This is enough to feed
                 <div className='textfield'><span className="animate__animated animate__pulse animate__infinite" id='values'>{people}</span></div> people for a day
             </p>
             <img src='/images/weightscale/dustbin.png' style={{float:'right',marginTop:'-40px',width:'160px',marginRight:'5px'}}/>

         </div>

        </div>

        <div style={{marginTop:'40px',marginLeft:'40px'}}>
            <div className='weightcard'>
            <img src='/images/weightscale/icon1.png'
             style={{marginLeft:'auto',marginRight:'auto',paddingTop:'10px'}}/><br/>
             <span className='spantxtclr'>Food waste costs our </span><br/>
             <span className='spantxtclr'> economy $36.6 billion</span><br/>
             <span className='spantxtclr'> a year.</span><br/>
            </div>

            <div className="weightcard">
            <img src='/images/weightscale/icon3.png'
            style={{marginLeft:'auto',marginRight:'auto',paddingTop:'10px'}}/><br/>
            <span className='spantxtclr' style={{fontWeight:600}}>15% </span><br/>
            <span className='spantxtclr'> of India is</span><br/>
            <span className='spantxtclr'> Undernourished </span><br/>
            </div>
 
        <div className="weightcard">
        <img src='/images/weightscale/icon5.png'
        style={{marginLeft:'auto',marginRight:'auto',paddingTop:'0px'}}/><br/>
        <span className='spantxtclr' style={{fontWeight:600}}>$1 trillion </span><br/>
        <span className='spantxtclr'> value of food waste</span><br/>
        <span className='spantxtclr'> happen globally in a year </span><br/>
        </div>
        </div>
        
        <div style={{marginTop:'40px',marginLeft:'40px'}}>
        <div className="weightcard">
        <img src='/images/weightscale/icon2.png'
        style={{marginLeft:'auto',marginRight:'auto',paddingTop:'15px'}}/><br/>
        <span className='spantxtclr' style={{fontWeight:600}}>20 million</span><br/>
        <span className='spantxtclr'> Indians</span><br/>
        <span className='spantxtclr'> Starve to sleep </span><br/>
        </div>

         <div className="weightcard">
        <img src='/images/weightscale/icon4.png'
        style={{marginLeft:'auto',marginRight:'auto',paddingTop:'10px'}}/><br/>
        <span className='spantxtclr' style={{fontWeight:600}}>20%</span><br/>
        <span className='spantxtclr'>of childern in</span><br/>
        <span className='spantxtclr'>India are Underweight</span><br/>
        </div>

          <div className="weightcard">
        <img src='/images/weightscale/icon6.png'
        style={{marginLeft:'auto',marginRight:'auto',paddingTop:'5px'}}/><br/>
        <span className='spantxtclr' style={{fontWeight:600}}>25% </span><br/>
        <span className='spantxtclr'>of the world’s fresh</span><br/>
        <span className='spantxtclr'>water supply is wasted</span><br/>
        </div>
    </div>
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
      </div>
      
    )
  }
}

//var PORT = "http://localhost:22004/NeuLogAPI?";//Main port
'use client'; 
import React, { useEffect } from 'react';
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
var calibrate = true;
const delay = ms => new Promise(res => setTimeout(res, ms));

const Calibration = () => {
  function calibrateMax(){
    //Pause any outstanding experiments
    //fetch(PORT + "StopExperiment")
    if(calibrate){

      // document.getElementById("pressure").innerHTML = "Disabled during calibration";
      document.getElementById("calibration_title").innerHTML = "Calibrating - Squeeze at Max Strength";
      document.getElementById("calibration").innerHTML = "End calibration";
      // useEffect(()=>{
      //   fetch(PORT + "StartExperiment")//add cleanup later
      // })
    }else{//!calibrate
      document.getElementById("calibration_title").innerHTML = "Begin Calibration";
      document.getElementById("calibration").innerHTML = "Calibrate";
    }
    calibrate = !calibrate; 
  }
  return (
    <div>
        <h2 id= "calibration_title">Calibration</h2>
        <button 
        type="button" id="calibration"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={calibrateMax}
        >Begin Calibration</button>
    </div>
  )
}   
export default Calibration;
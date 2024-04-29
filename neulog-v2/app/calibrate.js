'use client'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Line }            from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import React, { useEffect, useState, createRef} from 'react';
 
 
 
var PORT = "http://localhost:22004/NeuLogAPI?";//Main port
//var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
var calibrating = false;
export default function Experiment({updateStrength}){
  let calibrate = true;
    const options = {
      scales: {
        x:{
          type: 'linear'
        }
      }
    }
    // const data = fetch(PORT + "GetExperimentSamples:[HandDynamometer],[1]", {headers:{"Access-Control-Allow-Origin":"http://localhost:22004/NeuLogAPI/"}})
 

    const updateCalibration = async () => {

        if (!calibrating) {
            //Pause any outstanding experiments
            await fetch(PORT + "StopExperiment").then(() => {
                // Begin new experiment
                fetch(PORT + "StartExperiment:[HandDynamometer],[1],[8],[101]").then(() => {
                    document.getElementById("title").innerHTML = "Calibration... Squeeze at Max Strength!";
                    document.getElementById("calibration").innerHTML = "End calibration";
                    setTimeout(() => {
                        if (calibrating) {
                            updateCalibration()
                        }
                    }, 10000)
                });
            });
        }else{
            document.getElementById("calibration").innerHTML = "Calibrate";
            document.getElementById("title").innerHTML = "Click to Begin Calibration";
            fetch(PORT + "GetExperimentSamples").then((response) => response.json().then((data) => {
                let temp = data["GetExperimentSamples"][0].splice(2);
                updateStrength(Math.max.apply(null, temp));
                console.log(temp.length)
            }));
        }
        calibrating = !calibrating;
      
    }
    return(
      <div className="chart-container w-1/4">
        <h2 id="title" style={{ textAlign: "center" }}>Click to Begin Calibration</h2>   
        <button 
        type="button" id="calibration"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={updateCalibration}
        >Calibrate</button>
      </div>
    )
}

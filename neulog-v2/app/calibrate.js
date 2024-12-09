'use client'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import React, { useEffect, useState, createRef } from 'react';


var PORT = "http://localhost:22006/NeuLogAPI?";//Main port
//var PORT = "http://localhost:22006/NeuLogAPI/"//Dummy port
var calibrating = false;

export default function Experiment({ updateStrength }) {
  const [isCalibrated, setIsCalibrated] = useState(false);
  let calibrate = true;
  const options = {
    scales: {
      x: {
        type: 'linear'
      }
    }
  }

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
    } else {
      //Reset Text
      document.getElementById("calibration").innerHTML = "Calibrate";
      document.getElementById("title").innerHTML = "Click to Begin Calibration";
      //Calculate Max
      fetch(PORT + "GetExperimentSamples").then((response) => response.json().then((data) => {
        let temp = data["GetExperimentSamples"][0].splice(2);
        updateStrength(WidePeakFinding(temp));
        // Once we've updated the strength, we consider the device calibrated
        setIsCalibrated(true);
      }));
    }
    calibrating = !calibrating;
  }

  return (
    <div className="chart-container w-1/4 pl-4">
      <h2 id="title" className="text-2xl font-bold text-center">Click to Begin Calibration</h2>
      {!isCalibrated && (
        <p className="text-red-500 font-bold text-2xl mb-2 text-center">
          Hand Dynamometer not calibrated
        </p>
      )}
      <button
        type="button"
        id="calibration"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={updateCalibration}
      >Calibrate</button>
    </div>
  )

  function WidePeakFinding(signal) {
    const average = array => array.reduce((a, b) => a + b) / array.length;
    //https://www.baeldung.com/cs/signal-peak-detection#detecting-wide-peaks
    // INPUT
    //    signal = an array of signal values
    // OUTPUT
    //    indices = an array of indices that are part of a wide peak in the signal
    let cutArray = signal.filter((currentVal) => {
      return currentVal >= 0.1;
    })
    let peakIndices = [];
    let baseline = average(cutArray);
    for (let i = 0; i < cutArray.length; i++) {
      let value = cutArray[i]
      if (value > baseline)
        peakIndices.push(value);

    }
    return average(peakIndices);
  }
}

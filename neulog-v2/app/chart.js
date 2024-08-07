'use client'
import { Chart, Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import React, { useEffect, useState, createRef} from 'react';


var PORT = "http://localhost:22004/NeuLogAPI?";//Main port
//var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
//https://neulog.com/Downloads/NeuLog_API_version_8.pdf
var chartUpdating = false;
var dataLen = 0; // How long the last api request was
const THRESHOLD = 0.03; // Threshold to stay within for testing
const EXPERIMENT_LENGTH = 180; //Seconds
const NUM_CHART_ITEMS = 100;
function ChartMax({ updateStrength }) {

  let chartTimer = 0;
  let localmaxima = [];
  const [pulseData, setPulseData] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 },]);
  const [target, setTarget] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 }
  ])
  const [fillLevel, setFill] = useState('origin')
  const chartData = {
    // labels: labels,

    datasets: [
      {
        label: 'Data',
        backgroundColor: "rgb(255, 99, 132)",//Main Data
        borderColor: "rgb(255, 99, 132)",
        data: pulseData
      },
      {
        label: 'Target',
        fill: fillLevel,
        backgroundColor: "rgb(75, 240, 46, 1)",
        borderColor: "rgb(0, 0, 0, 1)",
        data: target,
        borderWidth: 0.2
      }
    ],
  };
  const options = {
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      x: {
        type: 'linear'
      }
    },
    animation: {
      duration: 500
  }
  }
  //Begin/end an experiment
  const toggleExperiment = async () => {
    ///FUNCTIONS
    const checkStrength = (value) => { //Check if current value is within thresholds
      let max = updateStrength(-1);
      if ((max * (0.3 - THRESHOLD)) > value) {//Not strong enough
        document.getElementById('pulseStrengths').innerHTML = "Squeeze harder!";
      }
      else if (max * (0.3 + THRESHOLD) < value) { // Too strong
        document.getElementById('pulseStrengths').innerHTML = "Squeeze lighter!";
      }
      else {
        document.getElementById('pulseStrengths').innerHTML = "Maintain pressure! " + max * (0.3);
      }
    }
    const updateChart = async() =>{
      fetch(PORT + "GetExperimentSamples").then((response) => response.json().then((data) => {
        if(chartUpdating){
          //Horrible optimization here, fix later. Maybe get hold previous data and only analyze the newest ones?
          let temp = data["GetExperimentSamples"][0].splice(1);
          if(temp.length >= NUM_CHART_ITEMS) temp.splice(0, temp.length - NUM_CHART_ITEMS);
          checkStrength(temp[temp.length - 1]);//Check if within thresholds
          let max = updateStrength(-1);
          setTarget([{ x: 0, y: max * (0.3 - THRESHOLD) }, { x: temp.length, y: max * (0.3 - THRESHOLD) }]);//Set max/min visualization
          setFill({ value: max * (0.3 + THRESHOLD) })
          for (let i = 0; i < temp.length; i++) {
            temp[i] = { x: i, y: temp[i] }
          }
          setPulseData(temp);
        }
      }));
    }

    //Pause any outstanding experiments
    fetch(PORT + "StopExperiment").then(() => {
      // Begin new experiment
      if (!chartUpdating) {
        document.getElementById("experiment").innerHTML = "Calculating...";
        document.getElementById("ChartTitle").innerHTML = "Pulse at 30% strength"
        //Set experiment time limit
        setTimeout(() => {
          if (chartUpdating) {
            toggleExperiment()
          }
        }, EXPERIMENT_LENGTH * 1000)

        try {
          fetch(PORT + "StartExperiment:[HandDynamometer],[1],[8],[" + (10 * EXPERIMENT_LENGTH) +"]").then(() => { 
            chartTimer = setInterval(() => updateChart(), 500)
          });
        } catch (err) {
          updateChart();
          console.log(err.message)
        }
      } else {//End experiment
        document.getElementById("experiment").innerHTML = "Begin Experiment";
        document.getElementById("ChartTitle").innerHTML = "Pulse Data"
        if (document.getElementById('underline_select').value == 'pulse') {//On Pulse Mode
          //   document.getElementById('pulseStrengths').innerHTML = "Squeeze lighter!";
        };
        fetch(PORT + "GetExperimentSamples").then((response) => response.json().then((data) => {
          if (data['GetExperimentSamples'][0].length > 2) {
            analyzeData(data['GetExperimentSamples'][0].splice(2));
          }
        }));
        clearInterval(chartTimer);
      }
      chartUpdating = !chartUpdating;
    })
  }



  const analyzeData = (data) => {
    if (document.getElementById('underline_select').value == 'pulse') {//On Pulse Mode
      localmaxima = [];
      //Find local maximums, to get the pulse strengths
      let dir = 1; //1 for up, -1 for down
      for (let i = 1; i < data.length; i++) {//Yeah I'm gonna iterate through like 1000s of points of data but idk if there's a better way to do this
        while (data[i + 1] * dir >= data[i] * dir && i < data.length - 1) { i++ }; //Find vertex
        if (dir == 1) localmaxima.push(data[i]);
        dir = -dir;
      }
      document.getElementById('pulseStrengths').innerHTML = "Pulse Strengths: " + localmaxima + "\n% In Range: " + localmaxima.reduce((val1, val2) => {
        let max = updateStrength(-1);
        if (val2 > max * (0.3 - THRESHOLD) && val2 < max * (0.3 + THRESHOLD)) {
          val1++;
        }
      }, 0);
    } else {
      //Not really sure how to analyze this, maybe amount of time not in range? 
      document.getElementById('pulseStrengths').innerHTML = '';
    }
  }
  const updateAnalysis = () => {
    if (!chartUpdating) {
      fetch(PORT + "GetExperimentSamples").then((response) => response.json().then((data) => {
        if (data['GetExperimentSamples'][0].length > 2) {
          analyzeData(data['GetExperimentSamples'][0].splice(2));
        }
      }));
    }
  }
  return (
    <div className="chart-container w-1/4">
      <div>
        <h2 style={{ textAlign: "center" }} id="ChartTitle">Grip Strength</h2>


        <Line data={chartData} options={options} />
        <form className="max-w-sm mx-auto">
          <label htmlFor="underline_select" className="sr-only">Choose measurement type</label>
          <select id="underline_select" onChange={updateAnalysis} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="pulse">Pulse</option>
            <option value="squeeze">Squeeze</option>
          </select>
        </form>

        <button
          type="button" id="experiment"
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={toggleExperiment}
        >Begin Experiment</button>
      </div>

      <div className='results'>
        <h2 id='pulseStrengths'></h2>
      </div>
    </div>
  )
}
export default ChartMax;
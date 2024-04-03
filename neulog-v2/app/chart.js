'use client'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Line }            from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import React, { useEffect, useState, createRef} from 'react';




//var PORT = "http://localhost:22004/NeuLogAPI?";//Main port
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
var calibrating = false;
const ChartMax = props => {
  let calibrate = true;
  const [pulseData, setPulseData] = useState([    
    {x:1, y:14},
    {x:2, y:35},
    {x:3, y:20},
    {x:4, y:28},
    {x:5, y:10},
    {x:6, y:30}]);
  const chartData = {
    // labels: labels,
    datasets: [
    {
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data:pulseData
    }], 
    };
    const options = {
      scales: {
        x:{
          type: 'linear'
        }
      }
    }
    // const data = fetch(PORT + "GetExperimentSamples:[HandDynamometer],[1]", {headers:{"Access-Control-Allow-Origin":"http://localhost:22004/NeuLogAPI/"}})


    const updateChart = async () => {
      //Pause any outstanding experiments
      await fetch(PORT + "StopExperiment").then(()=>{
        if(!calibrating){
          // Begin new experiment
          document.getElementById("calibration").innerHTML = "End calibration";
          try {
            fetch(PORT + "StartExperiment:[HandDynamometer],[1],[5],[1001]").then(()=>{
              let chartUpdate = setInterval(()=>{ //Update chart with data
                fetch(PORT + "GetExperimentSamples:[HandDynamometer],[1]").then((response)=>response.json().then((data)=>{
                  
                  let temp = data["GetExperimentSamples"][0].splice(1);
                  for(let i = 0; i < temp.length; i++){
                    temp[i] = {x:i, y:temp[i]}
                  }
                  setPulseData(temp);
                }))
              }, 1000)
            })
          } catch (err) {
              console.log(err.message)
          }
        }else{
          clearInterval(chartUpdate);
          document.getElementById("calibration").innerHTML = "Calibrate";

        }
        calibrating = !calibrating;
      })
      
      
      
    }
    return(
      <div className="chart-container w-1/4">
        <h2 style={{ textAlign: "center" }}>Line Chart</h2>
        <Line data={chartData} options={options}/>
        <button 
        type="button" id="calibration"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={updateChart}
        >Calibrate2</button>
      </div>
    )
}
export default ChartMax;
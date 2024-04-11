'use client'

import { Chart, Line }            from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import React, { useEffect, useState, createRef} from 'react';
 
 
 
 
// var PORT = "http://localhost:22004/NeuLogAPI?";//Main port
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
var calibrating = false;
function ChartMax({updateStrength}){
  let calibrate = true;
  let chartUpdate = 0;
  let localmaxima = [];
  const [pulseData, setPulseData] = useState([    
    {x:1, y:0},
    {x:2, y:0},]);
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
 
    const updateChart = async () => {
      //Pause any outstanding experiments
      await fetch(PORT + "StopExperiment").then(()=>{
        if(!calibrating){
          // Begin new experiment
          document.getElementById("experiment").innerHTML = "End experiment";
          try {
            fetch(PORT + "StartExperiment:[HandDynamometer],[1],[8],[101]").then(()=>{
              chartUpdate = setInterval(()=>{ //Update chart with data
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
          document.getElementById("experiment").innerHTML = "Begin Experiment";
          fetch(PORT + "GetExperimentSamples:[HandDynamometer],[1]").then((response)=>response.json().then((data)=>{
            analyzeData(data['GetExperimentSamples'][0].splice(1));
          }));
        }
        calibrating = !calibrating;
      })
    }
    const analyzeData = (data) =>{
      localmaxima = [];
      //Find local maximums, to get the pulse strengths
      let dir = 1; //1 for up, -1 for down
      for(let i = 1; i < data.length; i++){//Yeah I'm gonna iterate through like 1000s of points of data but idk if there's a better way to do this
        while(data[i+1] * dir >= data[i] * dir && i < data.length-1) {i++}; //Find vertex
        if(dir == 1) localmaxima.push(data[i]);
        dir = -dir;
      }
      document.getElementById('pulseStrengths').innerHTML = localmaxima;
      console.log(localmaxima)
    }
    return(
      <div className="chart-container w-1/4">
        <div>
        <h2 style={{ textAlign: "center" }}>Line Chart</h2>
        <Line data={chartData} options={options}/>
        <button 
        type="button" id="experiment"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={updateChart}
        >Begin Experiment</button>
        </div>
        <div className='results'>
          <h2 id = 'pulseStrengths'></h2>
        </div>
      </div>
    )
}
export default ChartMax;
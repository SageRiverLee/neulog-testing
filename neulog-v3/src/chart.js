import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Line }            from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import React, { useEffect, useState, createRef} from 'react';
import NextCors from 'nextjs-cors';
import axios from 'axios';

//var PORT = "http://localhost:22004/NeuLogAPI?";//Main port
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port

export default function ChartMax() {
  let calibrate = true;
  axios.get(PORT + "StartExperiment").then((response)=>{
    print(response.json());
  })
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


    const updateChart = async () => {
      //Pause any outstanding experiments
      
      // try {
      //   const data = await (await fetch(PORT + "GetExperimentSamples:[HandDynamometer],[1]")).json()
      //   console.log(data)
      //   // setPulseData(data)
      // } catch (err) {
      //     console.log(err.message)
      // }
      setPulseData(
        [{x:1, y:14},
        {x:2, y:35},
        {x:3, y:20}])
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
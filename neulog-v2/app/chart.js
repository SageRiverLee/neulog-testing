'use client'; 
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Line }            from 'react-chartjs-2'
import 'chartjs-adapter-moment';


export default function ChartMax() {
  // const labels = ["January", "February", "March", "April", "May", "June"];
  const data = {
    // labels: labels,
    datasets: [
    {
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data:[ 
      {x:1, y:14},
      {x:2, y:35},
      {x:3, y:20},
      {x:4, y:28},
      {x:5, y:10},
      {x:6, y:30}
      ]
    }], 
    };
    const options = {
      scales: {
        x:{
          type: 'linear'
        }
      }
    }
    return(
      <div className="chart-container w-1/4">
        <h2 style={{ textAlign: "center" }}>Line Chart</h2>
        <Line data={data} options={options}/>
      </div>
    )
}
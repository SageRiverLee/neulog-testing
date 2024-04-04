'use client'
import Calibration from './calibration.js';
import Chart from './chart.js';
import {useState} from "react"; 
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
export default async function Home() {
  const [maxStrength, setMaxStrength] = useState(-1);
  const updateStrength = (childData) =>{
    setMaxStrength(childData);
  }
  return (  
    <div>
    {maxStrength}
    <Chart updateStrength={updateStrength} />
    </div>
      
  );
}

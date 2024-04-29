'use client'
import Calibrate from './calibrate.js';
import Experiment from './chart.js';
import {useState} from "react"; 
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port
export default function Home() {
  const [maxStrength, setMaxStrength] = useState(-1);
  const updateStrength = (childData) =>{
    setMaxStrength(childData);
  }
  const apiMutex = () =>{//Handle who's calling the mutexs, update others

  }
  return (  
    <div>
    <Calibrate updateStrength={updateStrength}/>
    Max Strength: {maxStrength}
    <Experiment updateStrength={updateStrength} />
    </div>
      
  );
}

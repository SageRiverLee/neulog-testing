'use client'
import Calibrate from './calibrate.js';
import Experiment from './chart.js';
import PulseTable from './pulse.js';
import {useState} from "react"; 
var PORT = "http://localhost:22006/NeuLogAPI/"//Dummy port
export default function Home() {
  const [maxStrength, setMaxStrength] = useState(-1);
    const updateStrength = (childData) => { // Set max strength, or return the value
        if (childData < 0) {
            return maxStrength;
        }
        else {
            setMaxStrength(childData);
        }
    }
  const apiMutex = () =>{//Handle who's calling the mutexs, update others

  }
  return (  
    <div>
    <Calibrate updateStrength={updateStrength}/>
    <div className='text-left pl-4'>
      Max Strength: {maxStrength}
    </div>
    <Experiment updateStrength={updateStrength}/>
    {<PulseTable/>}
    </div>
      
  );
}

import Calibration from './calibration.js';
import Chart from './chart.js';
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port

export default function Home() {
  // try {
  //       fetch(PORT + "GetExperimentSamples:[HandDynamometer],[1]").then((data)=>{
  //         console.log(typeof(data))
  //       })
        
  //       // setPulseData(data)
  //     } catch (err) {
  //         console.log(err.message)
  //     }
  return (
    <div>
    {/* <Calibration /> */}
    <Chart />
    </div>

  );
}

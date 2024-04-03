import Calibration from './calibration.js';
import Chart from './chart.js';
var PORT = "http://localhost:22004/NeuLogAPI/"//Dummy port

export default function Home() {
  return (
    <div>
    {/* <Calibration /> */}
    <Chart />
    </div>

  );
}

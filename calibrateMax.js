const delay = ms => new Promise(res => setTimeout(res, ms));
function parseData() {
    fetch("http://localhost:22004/NeuLogAPI?GetExperimentSamples:[HandDynamometer],[1]").then((response) => response.json()).then(data => {
        //Convert to Array
        let slicedData = String(data["GetExperimentSamples"]).split(",")
        //First 2 datapoints are sensor type and id
        slicedData = slicedData.slice(2);
        //Convert to numbers
        slicedData = slicedData.map(x => Number(x));
        document.getElementById("calibration").innerHTML = "Begin Calibration";
        document.getElementById("calibration_title").innerHTML = "Calibration";
        document.getElementById("max_strength").innerHTML = "Max Strength: " + Math.max(...slicedData);
        calibrate = 0;
        fetch("http://localhost:22004/NeuLogAPI?StopExperiment")
        intervalID = setInterval(() => {
            fetch("http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]")
                .then((response) => response.json())
                .then((json) => { document.getElementById("pressure").innerHTML = "Current Hand Pressure: " + json["GetSensorValue"]; });
        }, 50);
    });
}
calibrate = 0;
document.getElementById("calibration").addEventListener('click', function () {
    if (calibrate == 0) {
        //Pause any outstanding experiments
        fetch("http://localhost:22004/NeuLogAPI?StopExperiment")
        //Pause the live sensor reading
        clearInterval(intervalID);
        document.getElementById("pressure").innerHTML = "Disabled during calibration";
        document.getElementById("calibration_title").innerHTML = "Calibrating - Squeeze at Max Strength";
        document.getElementById("calibration").innerHTML = "End calibration";
        calibrate = 1;
        //Begin Calibration Experiment
        fetch("http://localhost:22004/NeuLogAPI?StartExperiment:[HandDynamometer],[1],[4],[500]").then(async () => {
            await delay(5000).then(() => {
                parseData();
            }) //Wait for experiment to finish
            //Stop Experiment if still going

        });
    } else {
        //Calibration = 1, currently calibrating
        parseData();
    }
})


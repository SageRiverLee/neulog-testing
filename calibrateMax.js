const delay = ms => new Promise(res => setTimeout(res, ms));

document.getElementById("calibration").addEventListener('click', function () {
    //Pause any outstanding experiments
    fetch("http://localhost:22004/NeuLogAPI?StopExperiment")
    //Pause the live sensor reading
    clearInterval(intervalID);
    document.getElementById("pressure").innerHTML = "Disabled during calibration";
    document.getElementById("calibration").innerHTML = "Calibrating (Squeeze at max strength)...";
    //Begin Calibration Experiment
    fetch("http://localhost:22004/NeuLogAPI?StartExperiment:[HandDynamometer],[1],[4],[5000]").then(async () => {
        await delay(10000).then(()=>{
            fetch("http://localhost:22004/NeuLogAPI?GetExperimentSamples:[HandDynamometer],[1]").then((response) => response.json()).then(data => {
                fetch("http://localhost:22004/NeuLogAPI?StopExperiment")
                //Convert to Array
                let slicedData = String(data["GetExperimentSamples"]).split(",")
                //First 2 datapoints are sensor type and id
                slicedData = slicedData.slice(2);
                //Convert to numbers
                slicedData = slicedData.map(x => Number(x));
                document.getElementById("calibration").innerHTML = "Begin Calibration";
                document.getElementById("max_strength").innerHTML = "Max Strength: " + Math.max(...slicedData);
            });
        }) //Wait for experiment to finish
        //Stop Experiment if still going
        
    });
})
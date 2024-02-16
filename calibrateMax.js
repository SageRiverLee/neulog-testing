const delay = ms => new Promise(res => setTimeout(res, ms));

document.getElementById("calibration").addEventListener('click', function () {
    document.getElementById("calibration").innerHTML = "Calibrating (Squeeze at max strength)...";
    fetch("http://localhost:22004/NeuLogAPI?StartExperiment:[HandDynamometer],[1],[5],[50]")
        .then(async () => {
            await delay(1000);
            fetch("http://localhost:22004/NeuLogAPI?GetExperimentSamples:[HandDynamometer],[1]").then((response) => response.json()).then(data => {
                //Convert to Json
                //First 2 datapoints are sensor type and id
                //data = data.slice(2);
                console.log(JSON.parse(data));
                document.getElementById("max_strength").innerHTML = "Max Strength: " + Math.max(...data["GetExperimentSamples"]);
                document.getElementById("calibration").innerHTML = "Begin Calibration";
                
            });
        });
})
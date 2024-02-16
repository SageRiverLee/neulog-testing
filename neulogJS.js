
fetch("http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]")
    .then((response) => response.json())
    .then((json) => { document.getElementById("demo").innerHTML = json["GetSensorValue"]; console.log(json) });
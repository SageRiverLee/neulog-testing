import requests
import time
requests.get('http://localhost:22004/NeuLogAPI?SetSensorsID:[1]')
requests.get('http://localhost:22004/NeuLogAPI?StartExperiment:[HandDynamometer],[1],[8],[101]')
time.sleep(10)
x = requests.get('http://localhost:22004/NeuLogAPI?GetExperimentSamples:[HandDynamometer],[1],[8],[101]')
print(x.text)
# while True:
    # x = requests.get('http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]')
    # print(x.text)

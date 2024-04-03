import requests
import time
import msvcrt
import json

session = requests.Session()
print('Verifying API Connection')
r = session.get("http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]")
try:
    r.json()['GetSensorValue']
except:
    print("Neulog API Not Running")
    
#Ensure that sensor is at id:1
session.get("http://localhost:22004/NeuLogAPI?SetSensorsID:[1]")
print("Calibrating Strength... Squeeze Hand Dynamometer at max strength (press any key to begin)")
msvcrt.getch()
print("Experiment has begun: Squeeze at max strength to calibrate")
session.get("http://localhost:22004/NeuLogAPI?StartExperiment:[HandDynamometer],[1],[5],[500]")
time.sleep(5)
r = session.get("http://localhost:22004/NeuLogAPI?GetExperimentSamples:[HandDynamometer],[1]")
print("Strongest Grip Data: ", max(r.json()['GetExperimentSamples'][0][1:]))

while(True):
    start = time.time()
    r = requests.get("http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]")
    end = time.time()
    print(r.json())
    print("Seconds Elapsed: ", end - start)
"""
    Get the baseline strongest grip for calibration (how long to test for?) - likely set up as an experiment
    Calcualte 20(or is it 30)% of their max strength 
    Start experiment, tell user to start squeezing several times for (2 minutes?? get the amount of time)
    How do we test it though
    I would really like to have the research paper that he's talking about

"""
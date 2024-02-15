import requests
import time
print('Verifying API Connection')
r = requests.get("http://localhost:22004/NeuLogAPI?GetServerStatus")
if(r.json['GetServerStatus'] != "Ready"):
    raise Exception("Neulog API not running") 
print("Server status: ", r.json['GetServerStatus'])

input("Calibrating Strength... Squeeze Hand Dynamometer at max strength (press any key to begin)")
# while(True):
#     start = time.time()
#     r = requests.get("http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]")
#     end = time.time()

#     print(r.json())

#     print("Seconds Elapsed: ", end - start)
"""
    Get the baseline strongest grip for calibration (how long to test for?) - likely set up as an experiment
    Calcualte 20(or is it 30)% of their max strength 
    Start experiment, tell user to start squeezing several times for (2 minutes?? get the amount of time)
    How do we test it though
    I would really like to have the research paper that he's talking about

"""
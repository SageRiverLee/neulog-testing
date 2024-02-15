import requests
import time
r = requests.get("http://localhost:22004/NeuLogAPI?GetServerVersion")
print(r.json)
# while(True):
#     start = time.time()
#     r = requests.get("http://localhost:22004/NeuLogAPI?GetSensorValue:[HandDynamometer],[1]")
#     end = time.time()

#     print(r.json())

#     print("Seconds Elapsed: ", end - start)
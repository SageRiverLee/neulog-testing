# Post-Chronic Fatigue Research
## Project Overview:
This project aims to produce a low-intensity routine to accurately measure post-chronic fatigue using a Neulog hand dynamometer and React.js. By measuring the heart rate of a user squeezing a hand dynamometer at 30% max strength for 5 minutes. This data would then be displayed through a chart utilizing the Chart.js library. The program is accessible through a public github repository. 

## Build Instructions:
### Requirements:
- Windows 10 (neulog api non-functional in windows 11)
- Git
- Python 3.8+
- Node.js and npm
- [Neulog API](https://neulog.com/software/)
- [Neulog Hand Dynomometer](https://neulog.com/hand-dynamometer/) 
- [Neulog USB Module](https://neulog.com/hand-dynamometer/)
### Building

Download and install Neulog API.
Pull the repo
`git pull https://github.com/SageRiverLee/neulog-testing.git`

Change into directory
`cd .\neulog-v2\`

Download modules
`npm update`

### Launch program
 Attach hand dynamometer module to USB module, connect to PC. Launch Neulog API, ensure ready state. 

 Start server
 `npm run dev`

 Server will be open at [http://localhost:3000](http://localhost:3000)

 Contact sageriverlee@gmail.com for questions or concerns. 


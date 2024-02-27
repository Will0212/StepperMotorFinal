The code and steps involed to create Webapp to control a stepper motor for Neutron Calibration at CUTE
Authors: Vijay Iyer, Will McIntyre, Nate Cullen

Download node.js

Download arduino IDE

Create a new directory and run these commands in this order:
npm init
npm install express
npm install serial port
mkdir public
mkdir arduino
touch server.js
cd public
touch index.html

Copy the server.js code from this repository to your server.js file.

Copy the index.html code from this repository to your index.html file.

Change the serial port in server.js to the serial port you would like to use.

Change the port in server.js the server is ran from to the port you would like to run it off.

Open the arduino IDE, and copy the code from this repository into a new sketch.

The arduino code has arbritrary values programmed for the position of the detector and the position of the housing. Change these values in the goToHousing and goToDetector
functions to the values wanted when said values are determined prior to isntallation.

Save the arduino sketch to the arduino directory you created.

When the arduino is connected burn the code to the arduino prior to running the server.

Now the server should run accordingly

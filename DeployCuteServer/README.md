Author: Will McIntyre
Date: April 24th, 2024, these are currently the files on the new mini-mac and the server is already deployed to work with them. 

These are the required version of MotorTab.jsx, MotionSensorGrap.jsx and TabPage.jsx that need to be used to when deploying the cute server. 

As of April 24th, 2024, these are currently the files on the new mini-mac and the server is already deployed to work with them. 

To start the stepper motor server run: node server.js in /Users/cute/CUTE_Neutron_Calibration_System/Server

Then the motor can be controled from the Neutron Calibration system tab of the cute webpage.

The password is "Californium", it can be changed or removed in MotorTab.jsx

Currently there is issues with the restore value from data log button, besides this everything should work fine.

I am not sure if the websocket connection from the server to the cute page closes after not being used for a while, a sort of "heartbeat" periodcally send signals to the cute page could 
be implemented to assure this does not happen. 

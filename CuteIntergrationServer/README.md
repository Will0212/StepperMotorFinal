Authors: Vijay Iyer, Will McIntyre, Nate Cullen

THIS CODE ONLY WORKS WHEN CUTE SERVER IS RUN IN DEVELOPPER MODE, use code in DeployCuteServer directory in this repository to run the code on the deployed server

Note: The StandAloneCode directory steps must be completed prior to running the neutron calibration system on the cute server.

In the following path, CUTE_TRIUMF/cute_hub/src/pages/tabPage/tabs follow these commands in this order:

mkdir MotorTab

cd MotorTab

touch MotorTab.jsx

touch MotionSensorGraph.jsx

The contents of Motrtab.jsx and MotionSensorGraph.jsx are in this repository

Next go to this directory, CUTE_TRIUMF/cute_hub/src/pages/tabPage and open TabPage.jsx. This file will need to be edited to include the MotorTab onto the webpage, the edited file can be found in the repository.

Go to CUTE_TRIUMF/cute_hub/ and assure you are using the correct version of node, you made need to change it like so:

brew install nvm

export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"

source ~/.bash_profile

nvm install node

nvm use node

node --version

nvm install 16.14.0

Options to run the server:

Option 1: Run the cute server and the neutron calibration system servers independently

Option 2: Download the concurrently package in CUTE_TRIUMF/cute_hub by running the command npm install concurrently --save-dev

Next edit package.js to start the node.js server when the cute hub server is started: "start": "concurrently \"node /Users/willmcintyre/source/neutron_calibration_system || :\" \"react-scripts start\"", the edited package.json file is in this repository
edit the path so that the node command is used in the directory where the neutron calibration system server is stored, you may now usue npm start

// Tab to control the stepper motor
//Edited March 5, 2024
// All necassary imports
import React, { useState, useEffect, useRef } from 'react';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import LensIcon from '@material-ui/icons/Lens';
import { green, red, orange } from "@material-ui/core/colors";
import axios from 'axios';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MotionSensorGraph from './MotionSensorGraph';


const MotorTab = () => {

  // Set values
    const onStyle = { color: green[500] };
    const offStyle = { color: red[500] };
    const orangeStyle = { color: orange[500] };

    // Setting the intial values and their corresponding functions to change the values
    const [currentSourcePosition, setCurrentSourcePosition] = useState(0);
    const [currentDirection, setCurrentDirection] = useState('CounterClockWise');
    const [currentMotorControlEnabled, setCurrentMotorControlEnabled] = useState('OFF');
    const [currentOverrideStatus, setCurrentOverrideStatus] = useState('OFF');
    const [currentSignal, setCurrentSignal] = useState(0);
    const [chartData, setChartData] = useState(new Array(100).fill(null));
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGraphVisible, setIsGraphVisible] = useState(true);
    const [isChainDetected, setIsChainDetected] = useState(false);


    // Route to get the data stored in server.js change to localhost:port of port you are usiing
    const fetchData = async () => {
        try {
            const sourcePositionResponse = await axios.get('http://localhost:5001/get_source_position');
            setCurrentSourcePosition(sourcePositionResponse.data.sourcePosition);
    
            const directionResponse = await axios.get('http://localhost:5001/get_direction_status');
            setCurrentDirection(directionResponse.data.direction);
    
            const enabledValueResponse = await axios.get('http://localhost:5001/get_enabled_value');
            setCurrentMotorControlEnabled(enabledValueResponse.data.motorControlEnabled);
    
            const signalResponse = await axios.get('http://localhost:5001/get_sensor_signal');
            setCurrentSignal(signalResponse.data.signal);
    
            const overrideStatusResponse = await axios.get('http://localhost:5001/get_override_status');
            setCurrentOverrideStatus(overrideStatusResponse.data.overrideOn);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        }
    };

    // Fetch initial data when the component mounts
    useEffect(() => {
        fetchData();
    }, []); // This empty array ensures the effect runs only once when the component mounts


    // Fecthes data only every 100 ms
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 100);

        return () => clearInterval(interval);
    }, [currentSignal]);


    // updates the values store don the chart
    useEffect(() => {
        const updateChart = (dataValue) => {
            if (currentSignal > 20) {
                setChartData((prevChartData) => {
                    const newData = [...prevChartData];
                    newData.push(dataValue);
                    newData.shift();
                    return newData;
                });
            }
        };

        updateChart(currentSignal);

        setIsChainDetected(currentSignal > 30);
    }, [currentSignal]);


    //Route to handle motor commands
    const controlMotor = async (command, value) => {
      let url = `http://localhost:5001/control_motor?command=${command}`;
  
      if (value !== undefined) {
          url += `&value=${value}`;
      }
  
      try {
          const response = await axios.get(url);
          console.log(response.data);
          // Update state based on the response
          if (response.data.sourcePosition !== undefined) {
              setCurrentSourcePosition(response.data.sourcePosition);
          }
          if (response.data.direction !== undefined) {
              setCurrentDirection(response.data.direction);
          }
          if (response.data.motorControlEnabled !== undefined) {
              setCurrentMotorControlEnabled(response.data.motorControlEnabled);
          }
          if (response.data.overrideOn !== undefined) {
              setCurrentOverrideStatus(response.data.overrideOn);
          }
          if (response.data.signal !== undefined) {
              setCurrentSignal(response.data.signal);
          }
      } catch (error) {
          console.error('Error controlling motor:', error);
          setError(error);
      }
  };
  
    
    // Set the RPM value
    const submitRPMValue = () => {
        const RPMValue = document.getElementById('RPMInput').value;
        controlMotor('setRPM', RPMValue);
      };


    // Set to the last  postion store in the 
    const resetToPreviousPosition = async () => {
        try {
            const sourcePositionResponse = await axios.get('http://localhost:5001/reset_to_previous_position');
            setCurrentSourcePosition(sourcePositionResponse.data.sourcePosition);
        } catch (error) {
            console.error('Error resetting to previous position:', error);
            setError(error);
        }
    };

    // Set the password variable to the inputted value
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


    // Check if the password is the correct value
    const handlePasswordSubmit = () => {
        if (password === 'Californium') {
            setIsAuthenticated(true);
        }
    };


    // Toggle the visibilty of the graph
    const toggleGraphVisibility = () => {
        setIsGraphVisible((prevIsGraphVisible) => !prevIsGraphVisible);
    };


    //JSX page if the password has not been submitted
    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={1} direction="column" justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h4" align="center" gutterBottom>
                            Enter Password
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Input
                            id="passwordInput"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePasswordSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    // JSX page after the password is submitted
    return (
        <Container maxWidth="sm">
          <Grid container spacing={1} direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="h4" align="center" gutterBottom>
                Neutron Calibration System
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={1} direction="column" justifyContent="center" alignItems="center">
                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={1}>
                    <LensIcon style={currentMotorControlEnabled === 'ON' ? onStyle : offStyle} />
                  </Grid>
                  <Grid item xs={11}>
                    <ButtonGroup variant="contained" color="primary">
                      <Button onClick={() => controlMotor('start')}>Start Motor</Button>
                      <Button onClick={() => controlMotor('stop')}>Stop Motor</Button>
                      <Button onClick={() => controlMotor('changedirection')}>Change Direction</Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={11}>
                    <ButtonGroup variant="contained" color="primary">
                      <Button onClick={() => controlMotor('goToHousing')}>Send Source to Housing</Button>
                      <Button onClick={() => controlMotor('goToDetector')}>Send Source to Detector</Button>
                      <Button onClick={() => controlMotor('setPosZero')}>Set Position to 0</Button>
                      <Button onClick={resetToPreviousPosition}>Restore to Value From Data Log</Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
                <Grid container item xs={6} spacing={0}>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="RPMInput">RPM (1.875-187.5):</InputLabel>
                    <Input
                      id="RPMInput"
                      type="number"
                      name="RPM"
                      min="1.875"
                      max="187.5"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitRPMValue}
                    >
                      Submit RPM
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="h8" align="center" gutterBottom>
                    Source Position: {currentSourcePosition} meters
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h8" align="center" gutterBottom>
                    Current Direction: {currentDirection}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h8" align="center" gutterBottom>
                    Motor Control: {currentMotorControlEnabled}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h8" align="center" gutterBottom>
                    Override Status: {currentOverrideStatus}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button id="overrideButton" variant="contained" color="primary" onClick={() => controlMotor('overrideOn')}>
                    Override Mode:
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant="h8" align="center" gutterBottom>
                    Signal Value: {currentSignal}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h8" align="center" gutterBottom>
                    Chain Status: {isChainDetected ? 'Detected' : 'Not Detected'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={toggleGraphVisibility}>
                    Toggle Graph
                  </Button>
                </Grid>
                {isGraphVisible && (
                  <Grid item>
                    <MotionSensorGraph />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
    );
};

export default MotorTab;


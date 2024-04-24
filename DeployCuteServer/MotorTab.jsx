import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for any future HTTP requests (not used in current version)
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import LensIcon from '@material-ui/icons/Lens';
import { green, red, orange } from "@material-ui/core/colors";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MotionSensorGraph from './MotionSensorGraph'; // Custom component for displaying the graph
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://192.168.44.155:3600'); // Setup WebSocket connection
const MotorTab = () => {
    // Define styles for different motor states
    const onStyle = { color: green[500] };
    const offStyle = { color: red[500] };
    const orangeStyle = { color: orange[500] };
   
    // State hooks for various motor control parameters
    const [currentSourcePosition, setCurrentSourcePosition] = useState(0);
    const [currentDirection, setCurrentDirection] = useState('CounterClockWise');
    const [currentMotorControlEnabled, setCurrentMotorControlEnabled] = useState('OFF');
    const [currentOverrideStatus, setCurrentOverrideStatus] = useState('OFF');
    const [currentSignal, setCurrentSignal] = useState(0);
    const [isChainDetected, setIsChainDetected] = useState(false);
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const [chartData, setChartData] = useState(new Array(100).fill(null));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Establish WebSocket connection and define message handling
    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log('Received message from server:', message);
            const data = JSON.parse(message.data);
            console.log('Data received:', data);
            setCurrentSourcePosition(data.sourcePosition);
            setCurrentDirection(data.direction);
            setCurrentMotorControlEnabled(data.motorControlEnabled);
            setCurrentOverrideStatus(data.overrideOn);
            setCurrentSignal(data.signal);
        };
    }, []);

    // Function to send motor control commands via WebSocket
    const controlMotor = (command, value) => {
        const message = {
            command: command,
            value: value
        };
        client.send(JSON.stringify(message));
    };

    // Handler for submitting RPM value
    const submitRPMValue = () => {
        const RPMValue = document.getElementById('RPMInput').value;
        controlMotor('setRPM', RPMValue);
    };

    // Handler for resetting motor position to a previously stored value (is not currently working
    const resetToPreviousPosition = () => {
        const message = {
            command: 'resetToPreviousPosition'
        };
        client.send(JSON.stringify(message));
    };

    // Function to toggle the visibility of the graph
    const toggleGraphVisibility = () => {
        setIsGraphVisible(!isGraphVisible);
    };

    // Handler for form submission and password authentication
    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        if (event.target.password.value === 'Californium') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    // Render login screen if not authenticated
    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm">
                <form onSubmit={handlePasswordSubmit}>
                    <Typography variant="h6" gutterBottom>
                        Enter Password to Access Motor Controls
                    </Typography>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </form>
            </Container>
        );
    }

    // Main component rendering motor controls and information
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

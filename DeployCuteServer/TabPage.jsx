
import React, {useState} from 'react';
import {Box, Container, Grid, Tab, Tabs, useTheme} from "@material-ui/core";
import CalibCryoFridgeWideTab from "./tabs/CalibCryoDiaTab/CalibCryoFridgeWideTab";
import CalibratorInProgressIndicator from "../../components/CalibrationStatusIndicator/CalibrationStatusIndicator";
import ColoredPaper from "../../components/ColoredPaper/ColoredPaper";
import ValuesRibbon from "../../components/ValuesRibbon/ValuesRibbon";
import PlottingTab from "./tabs/PlottingTab/PlottingTab";
import ServerTab from "./tabs/ServerTab/ServerTab";
import MotorTab from "./tabs/MotorTab/MotorTab"; // Imported the contents of MotorTab directory
import CalibrationWidget from "../../widgets/CuteCalibrationWidget/CalibrationWidget";
import CalibCryoFridgeMediumTab from "./tabs/CalibCryoDiaTab/CalibCryoFridgeMediumTab";
import {ModuleDisplayStates} from '../../constants/moduleDisplayStates';
import {makeStyles} from "@material-ui/core/styles";
//import IframeWidget from "../../widgets/IframeWidget/IframeWidget"
import IframeList from "../../components/IframeList/IframeList";
import IframeData from "../../components/IframeList/IframeData";
import StatusWidget from "../../widgets/StatusWidget/StatusWidget";

// TODO uncomment the websockets you want and comment out or delete the test sockets
/////////////////////////////////////////////////////////////////////////////////////////////
// Calibration Websocket
// TODO: commented out all the stuff about calibration Websocket, am just going to pass in cryostatWebsocket
// TODO: maybe rename cryostatWebsocket > AVRWebsocket
//const calibrationWebsocket = new WebSocket("ws://192.168.44.30:8081", "cute");
// const calibrationWebsocket = new WebSocket('wss://echo.websocket.org');
//calibrationWebsocket.onopen = (event)=>{console.log("TabPage.js: Calibration Websocket Connected")};
//calibrationWebsocket.onopen = (event)=>{console.log("TabPage.js: Calibration Websocket Connected"); calibrationWebsocket.send("avr1: m0 pos")};
//calibrationWebsocket.onclose = () => {console.log("Calibration websocket connection closed")};
////////////////////////////////////////////////////////////////////////////////////////////// 
// Cryostat/AVR Websocket
const cryostatWebsocket = new WebSocket("ws://192.168.44.30:8080", "cute");
// const cryostatWebsocket = new WebSocket('wss://echo.websocket.org');
cryostatWebsocket.onopen = (event)=>{console.log("TabPage.js: Cryostat Websocket Connected")};
cryostatWebsocket.onclose = () => {console.log("Cryostat websocket connection closed")};
////////////////////////////////////////////////////////////////////////////////////////////// 
//const peltierWebsocket = new WebSocket("ws://192.168.44.30:8096", "cute");//original, worked in firefox
const peltierWebsocket = new WebSocket("ws://192.168.44.30:8096");
// const cryostatWebsocket = new WebSocket('wss://echo.websocket.org');
peltierWebsocket.onopen = (event)=>{console.log("TabPage.js: Peltier Websocket Connected")};
peltierWebsocket.onclose = () => {console.log("Peltier websocket connection closed")};

//const compressorWebsocket = new WebSocket("ws://192.168.44.30:8097", "cute");//original
const compressorWebsocket = new WebSocket("ws://192.168.44.30:8097");
// const cryostatWebsocket = new WebSocket('wss://echo.websocket.org');
compressorWebsocket.onopen = (event)=>{console.log("TabPage.js: Compressor Websocket Connected")};
compressorWebsocket.onclose = () => {console.log("Compressor websocket connection closed")};

const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: '1.2rem',
    }
}));


// Values which dictate at what width the screen will change form
const WindowBreakpoints = {
    FULL_SCREEN: 1585,
    ACCORDION: 800
}

const WindowStates = {
    NARROW: 0,
    ACCORDION: 1,
    FULL_SCREEN: 2,
}


function evaluateWindowWidth() {
    const width = window.innerWidth;

    if (WindowBreakpoints.FULL_SCREEN < width) {
        return WindowStates.FULL_SCREEN;
    }

    if (WindowBreakpoints.ACCORDION < width) {
        return WindowStates.ACCORDION;
    }

    return WindowStates.NARROW;
}

// This function checks what width the screen is currently
// and returns the appropriate Calibration/Crostat component
function getCalibCryoFridgeTab() {
    switch (evaluateWindowWidth()) {
        case WindowStates.NARROW:
            //return <CalibrationWidget calibWebSock={calibrationWebsocket} helpable displayState={ModuleDisplayStates.MINIMIZED} cryostatWS={cryostatWebsocket}/>;
            return <CalibrationWidget calibWebSock={cryostatWebsocket} helpable displayState={ModuleDisplayStates.MINIMIZED} cryostatWS={cryostatWebsocket}/>;
        case WindowStates.ACCORDION:
            return <CalibCryoFridgeMediumTab calibWebSock={cryostatWebsocket} cryostatWS={cryostatWebsocket} peltierWS={peltierWebsocket}/>;
        default:
            return <CalibCryoFridgeWideTab calibWebSock={cryostatWebsocket} cryostatWS={cryostatWebsocket} peltierWS={peltierWebsocket}/>;
    }
}


// Function which controls the displayed tabs
// to add a new tab enter a component into the 'tabs' list
// then enter the name of the tab you wish to be displayed on the 
// top bar
//var thermoPages = ["http://192.168.44.61/www/device.htm", "http://192.168.44.62/www/device.htm"];
//var heaterPages = ["http://192.168.44.64/www/device.htm"];
const thermoPages = [new IframeData("Low Temperature", "http://192.168.44.61/www/device.htm", "http://192.168.44.30/CUTE_docs/thermometry/LT_thermo"),
                     new IframeData("High Temperature", "http://192.168.44.62/www/device.htm", "http://192.168.44.30/CUTE_docs/thermometry/HT_thermo")];

const heaterPages = [new IframeData("Heaters", "http://192.168.44.64/www/device.htm", "http://192.168.44.30/CUTE_docs/thermometry/heater")];
function getTabs(){
    return {tabs: [getCalibCryoFridgeTab()
                , <PlottingTab/>
                , <IframeList iframeData={thermoPages} width={window.innerWidth} height={window.innerHeight/3}/>
                , <IframeList iframeData={heaterPages} width={window.innerWidth} height={window.innerHeight}/>
                , <ServerTab/>
                ,<MotorTab/> //Added Tab Name for Neutron Calibration System
            ],

            names:["Controls"
                , "Plotting"
                , "Thermometers"
                , "Heaters"
                , "Server Control"
                , "Neutron Calibration System"]} //Added tab name for Neutron Calibration System
}
//function getTabs(){
//    return {tabs: [getCalibCryoFridgeTab()
//                , <PlottingTab/>
//                , <IframeWidget url={thermoPages[0]} noName={true} width={window.innerWidth} height={window.innerHeight}/>
//                , <IframeWidget url={heaterPages} noName={true} width={window.innerWidth} height={window.innerHeight}/>],
//
//            names:["Controls"
//                , "Data"
//                , "Thermometers"
//                , "Heaters"]}
//}

function TabPage(props) {
    const theme = useTheme();
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [tabs, setTabs] = useState([ ...getTabs().tabs]);

    // This handles detecting the changing width of the screen and show the appropriate CalibCryoFridgeTabVersion
    window.onresize =
        () => {
            setTabs(getTabs().tabs);
        };

    const ActiveTab = tabs[value];

    const height = props.height ?? "auto";
    return (


        <Box width={1} height={height}>

            <ColoredPaper elevation={0} color={theme.palette.backgroundLight} parentSize square>
                <ColoredPaper color={theme.palette.primary} square elevation={0}>
                    <Grid item container direction='row' justify="space-between" wrap="nowrap" alignItems={"stretch"}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="secondary"
                                textColor="inherit"
                                centered>
                                {getTabs().names.map((c) => (
                                    <Tab key={c} label={c} className={classes.root}/>
                                ))}
                            </Tabs>
                        <StatusWidget/>
                    </Grid>
                </ColoredPaper>
                <ValuesRibbon calibWebSock={cryostatWebsocket} cryostatWS={cryostatWebsocket} peltierWS={peltierWebsocket} compressorWS={compressorWebsocket}/>
                {ActiveTab}
            </ColoredPaper>
        </Box>
    );
}

export default TabPage;

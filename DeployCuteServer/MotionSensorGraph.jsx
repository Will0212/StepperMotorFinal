import React, { useState, useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { w3cwebsocket as W3CWebSocket } from "websocket";

// Establish WebSocket connection for receiving real-time data
const client = new W3CWebSocket('ws://192.168.44.155:3600');

const MotionSensorGraph = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Initialize amCharts
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let tempChart = am4core.create(chartRef.current, am4charts.XYChart);
    tempChart.data = [];

    // Create axes
    const categoryAxis = tempChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.labels.template.disabled = true;

    const valueAxis = tempChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Signal Value";
    valueAxis.max = 1023;
    valueAxis.min = 0;
    valueAxis.strictMinMax = true;

    // Create series
    const series = tempChart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "time";
    series.stroke = am4core.color("#007bff"); // Blue color
    series.fill = series.stroke;
    series.fillOpacity = 0.5;

    setChart(tempChart);

    return () => {
      tempChart.dispose();
    };
  }, []);

  useEffect(() => {
    const handleData = (message) => {
      const data = JSON.parse(message.data);
      if (chart && data.signal) {
        const newData = {
          time: new Date().toISOString(),
          value: data.signal
        };
        chart.addData(newData, 1);  // Adds data and removes the oldest one
      }
    };

    client.onmessage = handleData;

    return () => {
      client.onmessage = null;
    };
  }, [chart]);

  return <div ref={chartRef} style={{ width: "400%", height: "500px", marginLeft: "-150%" }} />;
};

export default MotionSensorGraph;

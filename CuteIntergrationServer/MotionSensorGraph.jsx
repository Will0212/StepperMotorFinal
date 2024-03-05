// Graph used in Motor Tab
// Last Edited March 5, 2024
import React, { useState, useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { maxHeight, maxWidth } from '@material-ui/system';

const MotionSensorGraph = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Initialize amCharts
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    const chart = am4core.create(chartRef.current, am4charts.XYChart);

    // Add data
    chart.data = [];

    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer = new am4charts.AxisRendererX();
    categoryAxis.renderer.labels.template.disabled = true;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Signal Value"; // Set the title of the y-axis
    valueAxis.max=1023;
    valueAxis.min=0;
    valueAxis.strictMinMax = true;

    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.fill = am4core.color("#007bff").lighten(0.5); // Blue color
    series.fillOpacity = 0.5; // Set the fill opacity


    // Remove scrollbarX
    chart.scrollbarX = null;

    // Return a cleanup function to destroy the chart when the component unmounts
    setChart(chart);
    return () => {
      chart.dispose();
    };
  }, []);

  // Route to get the signal value of the motion sensor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/get_sensor_signal');
        const data = await response.json();

        if (data.signal > 20 && chartRef.current) {
          chart.data.push({
            category: new Date().toISOString(),
            value: data.signal
          });

          if (chart.data.length > 100) {
            chart.data.shift();
          }

          chart.invalidateData();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(fetchData, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [chart]);

  return <div ref={chartRef} style={{width: "1000%", height: "418px", marginLeft: "-250px"}} />;
};

export default MotionSensorGraph;

'use client';

import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import React, { useState } from 'react';

const TIME_WINDOW = 60000; // 60 seconds

const WidePeakFinding = (dataArr) => Math.max(...dataArr);

const PulseChart = () => {
  const [data, setData] = useState([]);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);

  const handleConnect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            namePrefix: 'Polar Sense',
            manufacturerData: [{ companyIdentifier: 0x006b }],
          },
        ],
        acceptAllDevices: false,
        optionalServices: [0x180d, 0x180f],
      });

      console.log('Selected device:', device.name);
      setDeviceName(device.name);

      const server = await device.gatt.connect();
      console.log('Connected to GATT server');
      setConnected(true);

      const hrService = await server.getPrimaryService(0x180d);
      const hrCharacteristic = await hrService.getCharacteristic(0x2a37);
      await hrCharacteristic.startNotifications();
      hrCharacteristic.addEventListener('characteristicvaluechanged', handleHeartRateChanged);

      const batteryService = await server.getPrimaryService(0x180f);
      const batteryCharacteristic = await batteryService.getCharacteristic(0x2a19);
      const batteryValue = await batteryCharacteristic.readValue();
      const battery = batteryValue.getUint8(0);
      setBatteryLevel(battery);
    } catch (error) {
      console.error('Bluetooth connection failed', error);
    }
  };

  const handleHeartRateChanged = (event) => {
    const value = event.target.value;
    const heartRate = value.getUint8(1);

    const newDataPoint = {
      time: Date.now(),
      value: heartRate,
    };

    // Update data: Keep only points within TIME_WINDOW
    setData((prevData) => {
      const cutoffTime = newDataPoint.time - TIME_WINDOW;
      const filteredData = prevData.filter((d) => d.time > cutoffTime);
      return [...filteredData, newDataPoint];
    });

    // Calculate peak
    const values = [...data.map((d) => d.value), heartRate];
    const peakValue = WidePeakFinding(values);
    console.log('Peak Heart Rate so far:', peakValue);
  };

  const chartData = {
    labels: data.map((entry) => new Date(entry.time)),
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: data.map((entry) => ({
          x: new Date(entry.time),
          y: entry.value,
        })),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  let chartOptions = {};

  if (data.length > 0) {
    const latestTime = data[data.length - 1].time;
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const yMin = minValue - 5;
    const yMax = maxValue + 5;

    chartOptions = {
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'second',
            displayFormats: {
              second: 'mm:ss',
            },
          },
          min: latestTime - TIME_WINDOW,
          max: latestTime,
          ticks: {
            display: false,
          },
        },
        y: {
          min: yMin,
          max: yMax,
        },
      },
    };
  } else {
    // Default range if no data
    chartOptions = {
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          ticks: {
            display: false,
          },
        },
        y: {
          min: 0,
          max: 10,
        },
      },
    };
  }

  return (
    <div className="pl-4">
      <h1 className="text-left">Bluetooth Heart Rate Monitor</h1>
      <div className="chart-container w-1/4">
        <Line data={chartData} options={chartOptions} />
      </div>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={handleConnect}
      >
        {connected ? 'Connected' : 'Connect to Polar Sense'}
      </button>

      {deviceName && <p>Connected to: {deviceName}</p>}
      {batteryLevel !== null && <p>Battery Level: {batteryLevel}%</p>}
    </div>
  );
};

export default PulseChart;

// src/App.js
// @ts-nocheck
import React from 'react';
import PredictionResultsChart from './components/PredictionResultsChart';
import {OpenAPI} from "./httpfunctions";

function App() {

    OpenAPI.BASE = "http://localhost:8000";
  return (
    <div className="App">
      <h1>FastAPI & Highcharts Example</h1>
      <PredictionResultsChart />
    </div>
  );
}

export default App;

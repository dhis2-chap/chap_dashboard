// src/App.js
// @ts-nocheck
import React from 'react';
//import PredictionResultsChart from './components/PredictionResultsChart';
import {OpenAPI} from "./httpfunctions";
//import EvaluationResultsChart from "@components/EvaluationResultsChartFromApi";
import ApiLoadedEvaluationResultsChart from "./components/ApiLoadedEvaluationResultsChart";
import EvaluationResultChartFromFileSelector from "./components/EvaluationResultChartFromFileSelector";

function App() {

    OpenAPI.BASE = "http://localhost:8000";
  return (
    <div className="App">
      <h1>DHIS2-CHAP Model Evaluation Dashboard</h1>
        <EvaluationResultChartFromFileSelector />
    </div>
  );
}

export default App;

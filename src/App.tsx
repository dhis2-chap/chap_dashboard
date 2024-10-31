// src/App.js
// @ts-nocheck
import React from 'react';
import {OpenAPI} from "./httpfunctions";
import EvaluationResultChartFromFileSelector from "./components/EvaluationResultChartFromFileSelector";
import MapPlot from "./components/MapPlot";
import { ComparisonPlot } from "./components/ComparisonPlot";
import { HighChartsData } from "../interfaces/HighChartsData";

const data1: HighChartsData = {
    periods: ["Jan", "Feb", "Mar", "Apr"],
    realValues: [10, 20, 15, 30],
    averages: [12, 18, 16, 28],
    ranges: [
        [8, 14],
        [15, 25],
        [12, 20],
        [25, 35],
    ],
    midranges: [
        [10, 12],
        [17, 19],
        [14, 18],
        [26, 32],
    ],
};

const data2: HighChartsData = {
    periods: ["Jan", "Feb", "Mar", "Apr"],
    realValues: [5, 15, 25, 20],
    averages: [7, 14, 22, 19],
    ranges: [
        [3, 9],
        [10, 18],
        [20, 30],
        [15, 25],
    ],
    midranges: [
        [5, 8],
        [13, 15],
        [21, 25],
        [17, 22],
    ],
};


function App() {

    OpenAPI.BASE = "http://localhost:8000";
  return (
    <div className="App">
            <ComparisonPlot
                orgUnit1="Org Unit 1"
                data1={data1}
                orgUnit2="Org Unit 2"
                data2={data2}
            />
      <h1>DHIS2-CHAP Model Evaluation Dashboard</h1>
        <EvaluationResultChartFromFileSelector />
    </div>
  );
}

export default App;

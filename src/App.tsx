// src/App.js
// @ts-nocheck
import React from 'react';
import {OpenAPI} from "./httpfunctions";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EvaluationResultChartFromFileSelector from "./components/EvaluationResultChartFromFileSelector";
import styles from './App.module.css';
import EvaluationDemo from "./components/EvaluationDemo";

function MainApp() {
  return (
          <div className={styles.container}>
              <h1>DHIS2-CHAP Model Evaluation Dashboard</h1>
              <EvaluationResultChartFromFileSelector />
          </div>
  );
}


function App() {
   OpenAPI.BASE = "http://localhost:8000";
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/demo" element={<EvaluationDemo/>} />
      </Routes>
    </Router>
  );
}


export default App;

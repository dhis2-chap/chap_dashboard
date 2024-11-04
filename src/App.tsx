// src/App.js
// @ts-nocheck
import React from 'react';
import {OpenAPI} from "./httpfunctions";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EvaluationResultChartFromFileSelector from "./components/EvaluationResultChartFromFileSelector";
import styles from './App.module.css';
import EvaluationDemo from "./components/EvaluationDemo";

function Wrapper(element: React.ReactNode) {
    return (
        <div className={styles.container}>
            <h1>DHIS2-CHAP Model Evaluation Dashboard</h1>
        {element}
        </div>
    );
}

function App() {
   OpenAPI.BASE = "http://localhost:8000";
  return (
    <Router>
      <Routes>
        <Route path="/" element={Wrapper(<EvaluationResultChartFromFileSelector />)} />
        <Route path="/demo" element={Wrapper(<EvaluationDemo/>)} />
      </Routes>
    </Router>
  );
}


export default App;

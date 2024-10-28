import React from 'react'
import {ResultPlot} from "./ResultPlot";
import {useEffect, useState} from "react";
import {DefaultService, EvaluationEntry, EvaluationResponse} from "../httpfunctions";
import {HighChartsData} from "../interfaces/HighChartsData";
import {createHighChartsData} from "../lib/dataProcessing";


function groupBy<T>(array: T[], keyFunction: (item: T) => string): Record<string, T[]> {
  const groupByStep = (result: Record<string, T[]>, currentItem: T): Record<string, T[]> => {
    const key: string = keyFunction(currentItem);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(currentItem);
    return result;
  }
  return array.reduce(groupByStep, {} as Record<string, T[]>);
}



const processDataValues = (data: EvaluationEntry[]): Record<string, HighChartsData> => {
  const predictions = data;
  const quantiles = Array.from(new Set(data.map(item => item.quantile))).sort();
  const lowQuantile = quantiles[0];
  const highQuantile = quantiles[quantiles.length - 1];
  const quantileFunc = (item: EvaluationEntry) => {
    if (item.quantile === lowQuantile) {
      return 'quantile_low';
    } else if (item.quantile === highQuantile) {
      return 'quantile_high';
    } else if (item.quantile === 0.5) {
      return 'median';
    } else {
        return 'quantile';
    }
  }
  const groupedData = groupBy(data, item => item.orgUnit.concat(item.splitPeriod));
  // Create a mapping of orgUnits to their respective chart data
  const orgUnitsProcessedData: Record<string, HighChartsData> = {};

  Object.keys(groupedData).forEach(orgUnit => {
    let groupedDatum = groupedData[orgUnit];
    let dataElement = createHighChartsData(groupedDatum, quantileFunc);
    orgUnitsProcessedData[orgUnit] = dataElement;
  });

  return orgUnitsProcessedData;

}

const EvaluationResultsChart = () => {
  const [orgUnitsData, setOrgUnitsData] = useState<Record<string, HighChartsData>>({});
  const [allSplitPeriods, setAllSplitPeriods] = useState<string[]>([]);
  const getData = async () => {
    const response = await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
    const orgUnitsProcessedData = processDataValues(response.predictions);
    setOrgUnitsData(orgUnitsProcessedData);
  }

  useEffect(() => {
    getData();
  }, []);
  return (
      <div>
        {Object.keys(orgUnitsData).map(orgUnit => (
            <div key={orgUnit} style={{marginBottom: '40px'}}>
              <h2>Predicted Disease Cases for {orgUnit}</h2>
              <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]}/>
            </div>
        ))}
      </div>
  );
}
export default EvaluationResultsChart;
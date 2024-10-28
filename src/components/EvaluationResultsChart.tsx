import React from 'react'
import {ResultPlot} from "./ResultPlot";
import {useEffect, useState} from "react";
import {DefaultService, EvaluationEntry, EvaluationResponse} from "../httpfunctions";
import {HighChartsData} from "../interfaces/HighChartsData";
import {createHighChartsData} from "../lib/dataProcessing";
import {SingleSelectField} from "@dhis2/ui";

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

function groupByTwoKeys<T>(
  array: T[],
  keyFunc1: (item: T) => string,
  keyFunc2: (item: T) => string
): { [key1: string]: { [key2: string]: T[] } } {
  return array.reduce((result, currentItem) => {
    const key1 = keyFunc1(currentItem);
    const key2 = keyFunc2(currentItem);

    // Initialize the first-level grouping if it doesn't exist
    if (!result[key1]) {
      result[key1] = {};
    }

    // Initialize the second-level grouping if it doesn't exist
    if (!result[key1][key2]) {
      result[key1][key2] = [];
    }

    // Push the current item into the correct group
    result[key1][key2].push(currentItem);

    return result;
  }, {} as { [key1: string]: { [key2: string]: T[] } });
}



const processDataValues = (data: EvaluationEntry[]): Record<string, Record<string, HighChartsData>> => {
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
  //const groupedData = groupBy(data, item => item.orgUnit.concat(item.splitPeriod));
  const doubleGroupedData = groupByTwoKeys(data, item => item.splitPeriod, item => item.orgUnit);
  // Create a mapping of orgUnits to their respective chart data
  const orgUnitsProcessedData: Record<string, Record<string, HighChartsData>> = {};
  Object.keys(doubleGroupedData).forEach(splitPeriod => {
    const splitProcessedData: Record<string, HighChartsData> = {};
    Object.keys(doubleGroupedData[splitPeriod]).forEach(orgUnit => {
      let groupedDatum = doubleGroupedData[splitPeriod][orgUnit];
      let dataElement = createHighChartsData(groupedDatum, quantileFunc);
      splitProcessedData[orgUnit] = dataElement;
    });
    orgUnitsProcessedData[splitPeriod] = splitProcessedData;
  });

  return orgUnitsProcessedData;

}

const EvaluationResultsChart = () => {
  const [orgUnitsData, setOrgUnitsData] = useState<Record<string, HighChartsData>>({});
  const [selectedSplitPeriod, setSelectedSplitPeriod] = useState<string>('');
  const [allSplitPeriods, setAllSplitPeriods] = useState<string[]>([]);
  const [allData, setAllData] = useState<Record<string, Record<string, HighChartsData>>>({} as Record<string, Record<string, HighChartsData>>);
  const getData = async () => {
    const response = await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
    const orgUnitsProcessedData = processDataValues(response.predictions);
    let strings = Object.keys(orgUnitsProcessedData);
    console.log(strings);
    setAllSplitPeriods(strings);
    setSelectedSplitPeriod(strings[0])
    setAllData(orgUnitsProcessedData);
    setOrgUnitsData(orgUnitsProcessedData[strings[0]]);
    //setOrgUnitsData(orgUnitsProcessedData);
  }

  useEffect(() => {
    getData();
  }, []);
  return (
      <div>
        <div>
          <select value={selectedSplitPeriod} onChange={e => {setOrgUnitsData(allData[e.target.value]); setSelectedSplitPeriod(e.target.value)}}>
            {allSplitPeriods.map(splitPeriod => (
                <option key={splitPeriod} value={splitPeriod}>{splitPeriod}</option>
            ))}
          </select>
        </div>
        <div>
          {Object.keys(orgUnitsData).map(orgUnit => (
            <div key={orgUnit} style={{marginBottom: '40px'}}>
              <h2>Predicted Disease Cases for {orgUnit}</h2>
              <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]}/>
            </div>
        ))}
          </div>
      </div>
  );
}
export default EvaluationResultsChart;
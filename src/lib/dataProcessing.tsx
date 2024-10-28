// @ts-nocheck

import {HighChartsData} from "../interfaces/HighChartsData";
import {DataElement} from "../httpfunctions";

export function joinRealAndPredictedData(predictedData: HighChartsData, realData: DataElement[]): HighChartsData {
    const predictionStart = predictedData.periods[0];
    const predictionEnd = predictedData.periods[predictedData.periods.length - 1];
    const realPeriodsFiltered = realData.map(item => item.pe).filter(period => period <= predictionEnd).sort().slice(-52);
    const realDataFiltered: number[] = realPeriodsFiltered.map(period => realData.find(item => item.pe === period)?.value ?? null);
    const nRealPeriods = realDataFiltered.length;
    //const nPredictedPeriods = predictedData.averages.length;
    //Pad the real data with zeros to match the number of predicted periods
    const padLength = realDataFiltered.length - predictedData.averages.length;
    const lastReal = realDataFiltered[padLength-1];
    const paddedAverage = Array(padLength-1).fill(null).concat([[lastReal]]).concat(predictedData.averages);
    const paddedRanges = Array(padLength-1).fill(null).concat([[lastReal, lastReal]]).concat(predictedData.ranges);
    const allPeriods = realPeriodsFiltered.concat(predictedData.periods);
    return {periods: allPeriods, ranges: paddedRanges, averages: paddedAverage, realValues: realDataFiltered};
}

export function createHighChartsData<T extends { period: string, value: number }>(groupedDatum: T[], quantileFunc: (item: T) => string): HighChartsData {
    const periods = Array.from(new Set(groupedDatum.map(item => item.period))).sort();
    const ranges: number[][] = [];
    const averages: number[][] = [];

    periods.forEach(period => {
        const quantileLow = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'quantile_low')?.value || 0;
        const quantileHigh = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'quantile_high')?.value || 0;
        const median = groupedDatum.find(item => item.period === period && quantileFunc(item) === 'median')?.value || 0;

        ranges.push([quantileLow, quantileHigh]);
        averages.push([median]);
    });

    let dataElement = {
        periods,
        ranges,
        averages
    };

    return dataElement;
}
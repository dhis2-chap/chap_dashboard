import {HighChartsData} from "../interfaces/HighChartsData";

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
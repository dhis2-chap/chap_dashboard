import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";

export interface HighChartsData{
    periods: string[];
    ranges: number[][];
    averages: number[][];
}

export const ResultPlot = (props: { orgUnit: string, data: HighChartsData }) => {
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                title: {
                    text: `Predicted Disease Cases for ${props.orgUnit}`,
                    align: 'left'
                },
                subtitle: {
                    text: 'Model: Model Name',
                    align: 'left'
                },
                xAxis: {
                    categories: props.data.periods, // Use periods as categories
                    title: {
                        text: 'Period'
                    },
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    min: 0
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: ' cases'
                },
                series: [{
                    name: 'Disease cases',
                    data: props.data.averages,
                    zIndex: 1,
                    marker: {
                        fillColor: 'white',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[0]
                    }
                }, {
                    name: 'Quantiles',
                    data: props.data.ranges,
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3,
                    zIndex: 0,
                    marker: {
                        enabled: false
                    }
                }]
            }}
        />
    );
}
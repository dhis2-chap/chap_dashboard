import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";
import {HighChartsData} from "../interfaces/HighChartsData";
import HighchartsMore from "highcharts/highcharts-more";
HighchartsMore(Highcharts); // Enables the 'arearange' series type

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
                series: [
                    {
                        name: 'Real Cases',
                        data: props.data.realValues,
                        zIndex: 2,
                        type: 'line',
                        color: Highcharts.getOptions().colors[2], // Different color for real data
                        marker: {
                            enabled: true,
                            lineWidth: 2,
                            fillColor: Highcharts.getOptions().colors[2]
                        }
                    },
                    {
                    name: 'Predicted Cases',
                    data: props.data.averages,
                    zIndex: 1,
                    marker: {
                        fillColor: 'white',
                        lineColor: Highcharts.getOptions().colors[0],
                        dashStyle: 'ShortDash', // Optional: to differentiate style
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
                    },
                }, {
                    name: 'QuantilesMid',
                    data: props.data.midranges,
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3,
                    zIndex: 0,
                    marker: {
                        enabled: false
                    },
                }]
            }}
        />
    );
}
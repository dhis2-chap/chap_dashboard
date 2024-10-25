// src/ResultsChart.js
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import {DataElement, DefaultService} from "./httpfunctions";
import {PredictionResponse} from "./httpfunctions/models/PredictionResponse";
import {FullPredictionResponse} from "./httpfunctions/models/FullPredictionResponse";

HighchartsMore(Highcharts); // Enables the 'arearange' series type


function groupBy(array: PredictionResponse[]): Record<string, PredictionResponse[]> {
  return array.reduce((result: Record<string, PredictionResponse[]>, currentItem:PredictionResponse) => {
    // Get the value of the specified key to group by
    const groupKey: string = currentItem.orgUnit;
    // If the group does not exist, create it
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    // Push the current item into the appropriate group
    result[groupKey].push(currentItem);
    console.log(result)
    return result;
  }, {}); // Start with an empty object
};

interface HighChartsData {
    periods: string[];
    ranges: number[][];
    averages: number[][];
}

function createHighChartsData(groupedDatum: PredictionResponse[]): HighChartsData {
  const periods = Array.from(new Set(groupedDatum.map(item => item.period))).sort();
  const ranges: number[][] = [];
  const averages: number[][] = [];

  periods.forEach(period => {
    const quantileLow = groupedDatum.find(item => item.period === period && item.dataElement === 'quantile_low')?.value || 0;
    const quantileHigh = groupedDatum.find(item => item.period === period && item.dataElement === 'quantile_high')?.value || 0;
    const median = groupedDatum.find(item => item.period === period && item.dataElement === 'median')?.value || 0;

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

const processDataValues = (data: PredictionResponse[]): Record<string, any> => {
  const groupedData = groupBy(data);
  console.log(groupedData)

  // Create a mapping of orgUnits to their respective chart data
  const orgUnitsProcessedData: Record<string, any> = {};

  Object.keys(groupedData).forEach(orgUnit => {
    let groupedDatum = groupedData[orgUnit];
    let dataElement = createHighChartsData(groupedDatum);
    orgUnitsProcessedData[orgUnit] = dataElement;
    });
  return orgUnitsProcessedData;
}

const ResultPlot = (props: {orgUnit: string, data: HighChartsData}) => {
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



const ResultsChart = () => {
  const [orgUnitsData, setOrgUnitsData] = useState<Record<string, HighChartsData>>({});
  const getData = async () => {
    const response = await DefaultService.getResultsGetResultsGet()
    const orgUnitsProcessedData = processDataValues(response.dataValues);
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
  // return (
  //   <div>
  //     {Object.keys(orgUnitsData).map(orgUnit => (
  //       <div key={orgUnit} style={{ marginBottom: '40px' }}>
  //         <h2>Predicted Disease Cases for {orgUnit}</h2>
  //         <HighchartsReact
  //           highcharts={Highcharts}
  //           options={{
  //             title: {
  //               text: `Predicted Disease Cases for ${orgUnit}`,
  //               align: 'left'
  //             },
  //             subtitle: {
  //               text: 'Model: Model Name',
  //               align: 'left'
  //             },
  //             xAxis: {
  //               categories: orgUnitsData[orgUnit].periods, // Use periods as categories
  //               title: {
  //                 text: 'Period'
  //               },
  //             },
  //             yAxis: {
  //               title: {
  //                 text: null
  //               },
  //               min: 0
  //             },
  //             tooltip: {
  //               crosshairs: true,
  //               shared: true,
  //               valueSuffix: ' cases'
  //             },
  //             series: [{
  //               name: 'Disease cases',
  //               data: orgUnitsData[orgUnit].averages,
  //               zIndex: 1,
  //               marker: {
  //                 fillColor: 'white',
  //                 lineWidth: 2,
  //                 lineColor: Highcharts.getOptions().colors[0]
  //               }
  //             }, {
  //               name: 'Quantiles',
  //               data: orgUnitsData[orgUnit].ranges,
  //               type: 'arearange',
  //               lineWidth: 0,
  //               linkedTo: ':previous',
  //               color: Highcharts.getOptions().colors[0],
  //               fillOpacity: 0.3,
  //               zIndex: 0,
  //               marker: {
  //                 enabled: false
  //               }
  //             }]
  //           }}
  //         />
  //       </div>
  //     ))}
  //   </div>
  // );
// };

export default ResultsChart;

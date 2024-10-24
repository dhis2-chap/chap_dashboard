// src/ResultsChart.js
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts); // Enables the 'arearange' series type

const ResultsChart = () => {
  const [orgUnitsData, setOrgUnitsData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/get-results')
      .then(response => {
        const data = response.data.dataValues;

        // Group data by unique orgUnits
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.orgUnit]) {
            acc[item.orgUnit] = [];
          }
          acc[item.orgUnit].push(item);
          return acc;
        }, {});

        // Create a mapping of orgUnits to their respective chart data
        const orgUnitsProcessedData = {};

        Object.keys(groupedData).forEach(orgUnit => {
          const periods = Array.from(new Set(groupedData[orgUnit].map(item => item.period))).sort();

          const ranges = [];
          const averages = [];

          periods.forEach(period => {
            const quantileLow = groupedData[orgUnit].find(item => item.period === period && item.dataElement === 'quantile_low')?.value || 0;
            const quantileHigh = groupedData[orgUnit].find(item => item.period === period && item.dataElement === 'quantile_high')?.value || 0;
            const median = groupedData[orgUnit].find(item => item.period === period && item.dataElement === 'median')?.value || 0;

            ranges.push([quantileLow, quantileHigh]);
            averages.push([median]);
          });

          orgUnitsProcessedData[orgUnit] = {
            periods,
            ranges,
            averages
          };
        });

        setOrgUnitsData(orgUnitsProcessedData);
      })
      .catch(error => {
        console.error("Error fetching data from FastAPI:", error);
      });
  }, []);

  return (
    <div>
      {Object.keys(orgUnitsData).map(orgUnit => (
        <div key={orgUnit} style={{ marginBottom: '40px' }}>
          <h2>Predicted Disease Cases for {orgUnit}</h2>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              title: {
                text: `Predicted Disease Cases for ${orgUnit}`,
                align: 'left'
              },
              subtitle: {
                text: 'Model: Model Name',
                align: 'left'
              },
              xAxis: {
                categories: orgUnitsData[orgUnit].periods, // Use periods as categories
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
//              plotOptions: {
//                series: {
//                  pointStart: Date.UTC(2024, 4, 1), // Replace with actual start date if needed
//                  pointIntervalUnit: 'day'
 //               }
//              },
              series: [{
                name: 'Disease cases',
                data: orgUnitsData[orgUnit].averages,
                zIndex: 1,
                marker: {
                  fillColor: 'white',
                  lineWidth: 2,
                  lineColor: Highcharts.getOptions().colors[0]
                }
              }, {
                name: 'Quantiles',
                data: orgUnitsData[orgUnit].ranges,
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
        </div>
      ))}
    </div>
  );
};

export default ResultsChart;

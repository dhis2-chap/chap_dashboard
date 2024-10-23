// src/ResultsChart.js
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts); // Enables the 'arearange' series type

const ResultsChart = () => {
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: 'Predicted Disease Cases for OrgUnit',
      align: 'left'
    },
    subtitle: {
      text: 'Model: Model Name',
      align: 'left'
    },
    xAxis: {
      type: 'datetime',
      accessibility: {
        rangeDescription: 'Range: April 1st 2022 to April 30th 2024.'
      }
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: ' cases'
    },
    plotOptions: {
      series: {
        pointStart: Date.UTC(2024, 4, 1), // Replace with actual start date if needed
        pointIntervalUnit: 'day'
      }
    },
    series: [{
      name: 'Disease cases',
      data: [], // Averages data will be set here
      zIndex: 1,
      marker: {
        fillColor: 'white',
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[0]
      }
    }, {
      name: 'Quantiles',
      data: [], // Ranges data will be set here
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
  });

  useEffect(() => {
    axios.get('http://localhost:8000/get-results')
      .then(response => {
        const data = response.data.dataValues.filter(item => item.orgUnit === 'boaco');

        // Extract and organize periods and quantiles
        const periods = Array.from(new Set(data.map(item => item.period))).sort();

        const ranges = [];
        const averages = [];

        periods.forEach(period => {
          const quantileLow = data.find(item => item.period === period && item.dataElement === 'quantile_low')?.value || 0;
          const quantileHigh = data.find(item => item.period === period && item.dataElement === 'quantile_high')?.value || 0;
          const median = data.find(item => item.period === period && item.dataElement === 'median')?.value || 0;

          // Prepare data for ranges and averages
          ranges.push([quantileLow, quantileHigh]);
          averages.push([median]);
        });

        // Update chart options
        setChartOptions(prevOptions => ({
          ...prevOptions,
          series: [
            {
              ...prevOptions.series[0],
              data: averages
            },
            {
              ...prevOptions.series[1],
              data: ranges
            }
          ]
        }));
      })
      .catch(error => {
        console.error("Error fetching data from FastAPI:", error);
      });
  }, []);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default ResultsChart;
//
//
//
// // src/ResultsChart.js
// import React, { useEffect, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import axios from 'axios';
//
// const ResultsChart = () => {
//   const [chartOptions, setChartOptions] = useState({
//     title: { text: 'Results Data' },
//     xAxis: { categories: [] },
//     series: [{ name: 'Values', data: [] }]
//   });
//
//   useEffect(() => {
//     // Fetch data from the FastAPI endpoint
//     axios.get('http://localhost:8000/get-results')
//       .then(response => {
//           console.log(response.data);
//           console.log(response.diseaseId);
//           const dataValues = response.data.dataValues.filter(item => item.orgUnit==='boaco').filter(item => item.dataElement==='median');
//         const values = dataValues.map(item => item.value);
//         const time_periods = dataValues.map(item => item.period);
//
//         // Update chart options
//         setChartOptions({
//           title: { text: 'Results Data' },
//           xAxis: { categories: time_periods },
//           series: [{ name: 'Values', data: values }]
//         });
//       })
//       .catch(error => {
//         console.error("Error fetching data from FastAPI:", error);
//       });
//   }, []);
//
//   return (
//     <div>
//       <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//     </div>
//   );
// };
//
// export default ResultsChart;

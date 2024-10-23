// src/ResultsChart.js
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const ResultsChart = () => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Results Data' },
    xAxis: { categories: [] },
    series: [{ name: 'Values', data: [] }]
  });

  useEffect(() => {
    // Fetch data from the FastAPI endpoint
    axios.get('http://localhost:8000/get-results')
      .then(response => {
          console.log(response.data);
          console.log(response.diseaseId);
          const dataValues = response.data.dataValues.filter(item => item.orgUnit==='boaco').filter(item => item.dataElement==='median');
        const values = dataValues.map(item => item.value);
        const time_periods = dataValues.map(item => item.period);

        // Update chart options
        setChartOptions({
          title: { text: 'Results Data' },
          xAxis: { categories: time_periods },
          series: [{ name: 'Values', data: values }]
        });
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

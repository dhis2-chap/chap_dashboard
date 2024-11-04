import React, { useState } from 'react';
import EvaluationResultsDashboard, {ComparisonDashboard} from './EvaluationResultDashboard';
import { processDataValues } from "../lib/dataProcessing";
import { HighChartsData } from "../interfaces/HighChartsData";

const EvaluationResultChartFromFileSelector: React.FC = () => {
  const [data, setData] = useState<Record<string, Record<string, HighChartsData>>>();
  const [data2, setData2] = useState<Record<string, Record<string, HighChartsData>>>();
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);
  const dataSetters = [setData, setData2];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, file_id: number = 0) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = JSON.parse(e.target?.result as string);
          const processedData = processDataValues(fileData.predictions, fileData.actualCases.data);
          const splitPeriods = Object.keys(processedData);
          dataSetters[file_id](processedData);
          console.log(file_id, processedData);
          setSplitPeriods(splitPeriods);
        } catch (error) {
          console.error("Error reading or processing file", error);
          // Handle error (e.g., show a message to the user)
        }
      };
      reader.readAsText(file);
    }
  };
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event, 1);
  return (
    <div>
      <h2> Upload a file</h2>
        <p>Upload a JSON file containing the evaluation results from CHAP to view the results.</p>
      <p><label>Choose file:</label>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </p>
      <p><label>Choose comparison file:</label>
        <input type="file" accept=".json" onChange={handleFileChange2} />
      </p>

      {(splitPeriods.length > 0) && (data!=undefined) && (data2!=undefined) &&
          <ComparisonDashboard data={data} data2={data2} splitPeriods={splitPeriods} />
        //<EvaluationResultsDashboard data={data} splitPeriods={splitPeriods} />
      }
    </div>
  );
};

export default EvaluationResultChartFromFileSelector;

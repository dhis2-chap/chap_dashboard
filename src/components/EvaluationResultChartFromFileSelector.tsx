import React, { useState } from 'react';
import EvaluationResultsDashboard from './EvaluationResultDashboard';
import { processDataValues } from "../lib/dataProcessing";
import { HighChartsData } from "../interfaces/HighChartsData";

const EvaluationResultChartFromFileSelector: React.FC = () => {
  const [data, setData] = useState<Record<string, Record<string, HighChartsData>>>({});
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = JSON.parse(e.target?.result as string);
          const processedData = processDataValues(fileData.predictions, fileData.actualCases.data);
          const splitPeriods = Object.keys(processedData);
          setData(processedData);
          setSplitPeriods(splitPeriods);
        } catch (error) {
          console.error("Error reading or processing file", error);
          // Handle error (e.g., show a message to the user)
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {splitPeriods.length > 0 && (
        <EvaluationResultsDashboard data={data} splitPeriods={splitPeriods} />
      )}
    </div>
  );
};

export default EvaluationResultChartFromFileSelector;

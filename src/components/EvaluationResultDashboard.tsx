import React from 'react';
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";

interface EvaluationResultsChartProps {
  data: Record<string, Record<string, HighChartsData>>;
  splitPeriods: string[];
}

const EvaluationResultsDashboard: React.FC<EvaluationResultsChartProps> = ({ data, splitPeriods }) => {
  const [orgUnitsData, setOrgUnitsData] = React.useState<Record<string, HighChartsData>>(data[splitPeriods[0]]);
  const [selectedSplitPeriod, setSelectedSplitPeriod] = React.useState<string>(splitPeriods[0]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSplitPeriod(e.target.value);
    setOrgUnitsData(data[e.target.value]);
  };

  return (
    <div>
      <div>
        <select value={selectedSplitPeriod} onChange={handlePeriodChange}>
          {splitPeriods.map((splitPeriod) => (
            <option key={splitPeriod} value={splitPeriod}>
              {splitPeriod}
            </option>
          ))}
        </select>
      </div>
      <div>
        {Object.keys(orgUnitsData).map((orgUnit) => (
          <div key={orgUnit} style={{ marginBottom: '40px' }}>
            <h2>Predicted Disease Cases for {orgUnit}</h2>
            <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationResultsDashboard;
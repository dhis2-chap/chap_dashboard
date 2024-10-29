import React from 'react';
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";
import { Virtuoso } from 'react-virtuoso';

interface EvaluationResultsChartProps {
  data: Record<string, Record<string, HighChartsData>>;
  splitPeriods: string[];
}
interface ResultPlotListProps {
  orgUnitsData: Record<string, HighChartsData>;
}

const ResultPlotList: React.FC<ResultPlotListProps> = ({ orgUnitsData}) => {
  return (
    <Virtuoso
      style={{ height: '100vh' }}
      totalCount={Object.keys(orgUnitsData).length}
      itemContent={(index) => {
        const orgUnit = Object.keys(orgUnitsData)[index];
        return (
          <div key={orgUnit} style={{ marginBottom: '40px' }}>
            <ResultPlot orgUnit={orgUnit} data={orgUnitsData[orgUnit]} />
          </div>
        );
      }}
    />
  );
};



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
          <h2>View split period</h2>
          The split period is the first period where the model predicts. The further the predicted period is away from the split period, the less accurate the prediction.
          CHAP uses many split periods in order to get many predictions to evalaute the model. This gives the model more opportunities to make 'mistakes' which we can pick up on.
          It's therefore important to look at many split periods when evaluating a model. (Note: loading a new split period might take some time)<br />

        <label>Select the split period: </label>
        <select value={selectedSplitPeriod} onChange={handlePeriodChange}>
          {splitPeriods.map((splitPeriod) => (
            <option key={splitPeriod} value={splitPeriod}>
              {splitPeriod}
            </option>
          ))}
        </select>
      </div>
      <div>
          <ResultPlotList orgUnitsData={orgUnitsData} />
      </div>
    </div>
  );
};

export default EvaluationResultsDashboard;
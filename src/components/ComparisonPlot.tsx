import React from "react";
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";

interface SideBySidePlotsProps {
    data1: HighChartsData;
    data2: HighChartsData;
    orgUnit1: string;
}

export const ComparisonPlot: React.FC<SideBySidePlotsProps> = ({ data1, data2, orgUnit1}) => {
    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <ResultPlot orgUnit={orgUnit1} data={data1} />
            <ResultPlot orgUnit={orgUnit1} data={data2} />
        </div>
    );
};

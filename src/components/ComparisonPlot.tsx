import React from "react";
import { ResultPlot } from "./ResultPlot";
import { HighChartsData } from "../interfaces/HighChartsData";
import styles from "../styles/ComparisonPlot.module.css";


interface SideBySidePlotsProps {
    data1: HighChartsData;
    data2: HighChartsData;
    orgUnit1: string;
}

export const ComparisonPlot: React.FC<SideBySidePlotsProps> = ({ data1, data2, orgUnit1}) => {
    return (
        <div className={styles.comparionPair}>
         <div className={styles.title}>{orgUnit1}</div>

        <div className={styles.sideBySide}>
            <ResultPlot orgUnit={orgUnit1} data={data1} />
            <ResultPlot orgUnit={orgUnit1} data={data2} />
        </div>
        </div>
    );
};

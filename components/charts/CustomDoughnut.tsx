import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Done", "Target"],
  datasets: [
    {
      label: "# of orders",
      data: [12, 50],
      backgroundColor: ["#fbdc0080", "#54258280"],
      borderColor: ["#fbdc00", "#542582"],
      borderWidth: 1,
    },
  ],
};

export function CustomDoughnut() {
  return <Doughnut width={50} data={data} />;
}

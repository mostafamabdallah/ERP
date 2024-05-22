import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 20,
    },
  },
};

export function CustomLine({ labels, data }: any) {
  const dataConfig = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: data,
        borderColor: "#542582",
        backgroundColor: "#54258260",
      },
    ],
  };
  return <Line height={"80px"} options={options} data={dataConfig} />;
}

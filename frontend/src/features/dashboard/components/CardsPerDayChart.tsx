import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

const CardsPerDayChart = () => {
  const { cardsPerDay } = useAppSelector((state) => state.dashboard);

  const labels = cardsPerDay.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Cards Created",
        data: cardsPerDay.map((item) => item.count),
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value: string | number) {
            const num = typeof value === "number" ? value : Number(value);

            if (Number.isInteger(num)) {
              return num;
            }

            return "";
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        Cards Created Per Day
      </h3>

      <Line data={data} options={options} />
    </div>
  );
};

export default CardsPerDayChart;

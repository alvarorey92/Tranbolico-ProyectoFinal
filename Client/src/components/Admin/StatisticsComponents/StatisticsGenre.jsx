import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { AppContext } from "../../../context/TranbolicoContextProvider";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const StatisticsGenre = () => {
  const { globalState } = useContext(AppContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/statistics/statisticsGenre",
        {
          headers: { Authorization: `Bearer ${globalState.token}` },
        }
      );
      setData(res.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    genre,
    user_count,
  }) => {
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const radius2 = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x2 = cx + radius2 * Math.cos(-midAngle * RADIAN);
    const y2 = cy + radius2 * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={x}
          y={y}
          fill="black"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {genre === 1
            ? `Masculino - ${user_count}`
            : genre === 2
            ? `Femenino - ${user_count}`
            : genre === 3
            ? `No binario - ${user_count}`
            : `Null - ${user_count}`}
        </text>
        <text
          x={x2}
          y={y2}
          fill="white"
          textAnchor={x2 > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  };

  return (
    <>
      {data && (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="user_count"
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )}
    </>
  );
};

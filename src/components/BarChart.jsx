import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [40, 39, 10, 40, 39, 80, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: [59, 39, 80, 40, 39, 80, 40],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const BarChartComponent = (props) => {

    const [chartData, setChartData] = useState(props.data);

    useEffect(() => {
        if (props.data !== undefined)
            setChartData(props.data);

    }, [props.data])

    return (
        <div className="bar-chart">
            {
                chartData !== undefined ? (
                    <ResponsiveContainer width="99%" height={300}>
                        <BarChart
                            width={300}
                            height={500}
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip wrapperStyle={{fontSize: "1.2rem"}}/> 
                            <XAxis dataKey="label" interval={0} angle={45} dy={15} />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="count" fill="#e78e23" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <h6>
                        🍞 Chart still loading ...
                    </h6>
                )
            }
        </div>
    )
}

export default BarChartComponent;

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IMCChart = ({ imc, calorias }) => {
    if (!imc || !calorias) return null;

    const data = [
        { name: 'IMC actual', value: parseFloat(calorias["IMC"]) },
        { name: 'Percentil', value: imc.percentile },
        { name: 'Z-score', value: imc.zscore },
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-sky-700 mb-2">📊 IMC y percentiles</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IMCChart;

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
    Cell,
} from "recharts";

const IMCChart = ({ imc, peso_por_edad, altura_por_edad }) => {
    if (!imc || !peso_por_edad || !altura_por_edad) return null;

    const data = [
        {
            nombre: "IMC",
            percentil: imc.percentile,
            color: "#0ea5e9",
        },
        {
            nombre: "Peso",
            percentil: peso_por_edad.percentile,
            color: "#10b981",
        },
        {
            nombre: "Altura",
            percentil: altura_por_edad.percentile,
            color: "#6366f1",
        },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition">
            <h3 className="text-sm font-semibold text-sky-700 mb-3">
                Percentiles actuales por indicador
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}`} />
                    <Bar
                        dataKey="percentil"
                        isAnimationActive={true}
                        radius={[4, 4, 0, 0]}
                    >
                        <LabelList
                            dataKey="percentil"
                            position="top"
                            formatter={(value) => `Percentil ${value.toFixed(1)}`}
                        />
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IMCChart;

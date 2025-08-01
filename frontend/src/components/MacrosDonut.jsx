import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6'];

const MacrosDonut = ({ macros }) => {
    if (!macros) return null;

    const data = [
        { name: 'Carbohidratos', value: macros.carbohidratos },
        { name: 'Proteínas', value: macros.proteinas },
        { name: 'Grasas', value: macros.grasas },
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-sky-700 mb-2">🧬 Macronutrientes</h3>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MacrosDonut;

const diasOrdenados = [
    "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
];

const MealPlanViewer = ({ plan }) => {
    if (!plan || !plan.plan) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                Plan alimenticio semanal
            </h2>

            {diasOrdenados.map((dia) => {
                const data = plan.plan[dia];
                if (!data) return null;

                return (
                    <div
                        key={dia}
                        className="border border-gray-100 rounded-md p-4 bg-gray-50 space-y-2"
                    >
                        <h3 className="text-lg font-medium text-gray-800 capitalize">{dia}</h3>
                        <p className="text-sm text-gray-700">
                            <strong>Calorías totales:</strong> {data.calorias_totales} kcal
                        </p>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Macronutrientes:</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>Carbohidratos: {data.macros.carbohidratos} g</li>
                                <li>Proteínas: {data.macros.proteinas} g</li>
                                <li>Grasas: {data.macros.grasas} g</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Comidas:</p>
                            {Object.entries(data.comidas).map(([comida, items]) => (
                                <div key={comida}>
                                    <strong className="capitalize text-sm text-gray-800">{comida}:</strong>
                                    <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                                        {items.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MealPlanViewer;

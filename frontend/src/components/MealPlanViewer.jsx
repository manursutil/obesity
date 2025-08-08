const diasOrdenados = [
    "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
];

const MealPlanViewer = ({ plan }) => {
    if (!plan || !plan.plan) return null;

    return (
        <div className="space-y-5">
            {/* Title */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-sky-700">
                    📅 Plan alimenticio semanal
                </h2>

                {/* Totals chip (optional if your API provides it) */}
                {plan.total_calorias && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 text-xs font-medium">
                        🔢 Total semanal: {plan.total_calorias} kcal
                    </span>
                )}
            </div>

            {/* Days */}
            <div className="grid grid-cols-1 gap-4">
                {diasOrdenados.map((dia) => {
                    const data = plan.plan[dia];
                    if (!data) return null;

                    return (
                        <details
                            key={dia}
                            className="group rounded-xl border border-sky-100/80 bg-white/70 backdrop-blur p-0 shadow-sm transition"
                        >
                            {/* Day header */}
                            <summary className="list-none flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full grid place-items-center bg-sky-100 text-sky-700">🍽️</div>
                                    <h3 className="text-base font-medium text-sky-800 capitalize">{dia}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5">
                                        {data.calorias_totales} kcal
                                    </span>
                                    <span className="transition-transform group-open:rotate-180">⌄</span>
                                </div>
                            </summary>

                            {/* Content */}
                            <div className="px-4 pb-4 pt-1 space-y-4">
                                {/* Macros + totals row */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="rounded-lg border border-gray-200 bg-white/80 p-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">🧬 Macronutrientes</p>
                                        <ul className="text-sm text-gray-700 grid grid-cols-3 gap-2">
                                            <li className="rounded-md bg-sky-50 border border-sky-200 px-2 py-1 text-center">
                                                <span className="font-semibold">{data.macros.carbohidratos}</span> g<br />
                                                <span className="text-[11px] text-sky-700">Carbs</span>
                                            </li>
                                            <li className="rounded-md bg-teal-50 border border-teal-200 px-2 py-1 text-center">
                                                <span className="font-semibold">{data.macros.proteinas}</span> g<br />
                                                <span className="text-[11px] text-teal-700">Proteínas</span>
                                            </li>
                                            <li className="rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-center">
                                                <span className="font-semibold">{data.macros.grasas}</span> g<br />
                                                <span className="text-[11px] text-amber-700">Grasas</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Meals */}
                                <div className="rounded-lg border border-gray-200 bg-white/80 p-3">
                                    <p className="text-sm font-medium text-gray-700 mb-2">🍽️ Comidas</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Object.entries(data.comidas).map(([comida, items]) => (
                                            <div key={comida} className="rounded-md bg-gray-50/80 border border-gray-200 p-3">
                                                <strong className="capitalize text-sm text-gray-800">{comida}</strong>
                                                <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
                                                    {items.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </details>
                    );
                })}
            </div>
        </div>
    );
};

export default MealPlanViewer;

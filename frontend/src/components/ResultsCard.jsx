const ResultsCard = ({ results }) => {
    if (!results) return null;

    const imc = results.imc || null;
    const peso = results.peso_por_edad || null;
    const altura = results.altura_por_edad || null;
    const calorias = results.calorias || null;

    // badge color helper
    const badge = (label) => {
        if (!label) return "bg-gray-100 text-gray-800";
        if (label.includes("normal")) return "bg-green-100 text-green-800";
        if (label.includes("Sobrepeso")) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div className="space-y-4 text-sm text-gray-800">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-sky-700">📊 Resultados</h2>
                {/* quick glance chips if available */}
                {imc?.classification && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${badge(imc.classification)} border-transparent`}>
                        IMC: {imc.classification}
                    </span>
                )}
            </div>

            {/* Calorías */}
            {calorias && (
                <details
                    open
                    className="group rounded-xl border border-sky-100/80 bg-white/70 backdrop-blur p-0 shadow-sm transition"
                >
                    <summary className="list-none flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full grid place-items-center bg-teal-100 text-teal-700">🔥</div>
                            <span className="text-sm font-semibold tracking-tight text-sky-700">Requerimiento calórico</span>
                        </div>
                        <span className="text-xs text-gray-600 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 space-y-2">
                        <p><strong>Tasa Metabólica Basal (Schofield):</strong> {calorias["TMB (Schofield)"]} kcal</p>
                        <p><strong>Tasa Metabólica Basal (OMS):</strong> {calorias["TMB (OMS)"]} kcal</p>
                        <p><strong>Gasto Energético Total (Schofield):</strong> {calorias["GET (Schofield)"]} kcal</p>
                        <p><strong>Gasto Energético Total (OMS):</strong> {calorias["GET (OMS)"]} kcal</p>
                        <p><strong>IMC:</strong> {calorias["IMC"]}</p>
                        <p className="flex items-center gap-2">
                            <strong>Clasificación:</strong>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${badge(calorias["Clasificación OMS"])}`}>
                                {calorias["Clasificación OMS"]}
                            </span>
                        </p>
                        <p><strong>Actividad física:</strong> {calorias["Nivel de actividad"]}</p>
                        {calorias["Sugerencia"] && (
                            <p className="rounded-md bg-amber-50 border border-amber-200 px-2 py-1">
                                <strong>Sugerencia:</strong> {calorias["Sugerencia"]}
                            </p>
                        )}
                    </div>
                </details>
            )}

            {/* IMC */}
            {imc && (
                <details className="group rounded-xl border border-sky-100/80 bg-white/70 backdrop-blur p-0 shadow-sm transition">
                    <summary className="list-none flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full grid place-items-center bg-sky-100 text-sky-700">📏</div>
                            <span className="text-sm font-semibold tracking-tight text-sky-700">IMC</span>
                        </div>
                        <span className="text-xs text-gray-600 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="rounded-md bg-gray-50 border border-gray-200 px-2 py-1">
                                <strong>IMC:</strong> {imc.value}
                            </div>
                            <div className="rounded-md bg-gray-50 border border-gray-200 px-2 py-1">
                                <strong>Z-score:</strong> {imc.zscore}
                            </div>
                            <div className="rounded-md bg-gray-50 border border-gray-200 px-2 py-1">
                                <strong>Percentil:</strong> {imc.percentile}
                            </div>
                            <div className="rounded-md bg-gray-50 border border-gray-200 px-2 py-1">
                                <strong>Estado:</strong>{" "}
                                <span className={`px-2 py-0.5 text-xs rounded-full ${badge(imc.classification)}`}>
                                    {imc.classification}
                                </span>
                            </div>
                        </div>
                    </div>
                </details>
            )}

            {/* Peso para la edad */}
            {peso && (
                <details className="group rounded-xl border border-sky-100/80 bg-white/70 backdrop-blur p-0 shadow-sm transition">
                    <summary className="list-none flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full grid place-items-center bg-teal-100 text-teal-700">⚖️</div>
                            <span className="text-sm font-semibold tracking-tight text-sky-700">Peso para la edad</span>
                        </div>
                        <span className="text-xs text-gray-600 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 space-y-2">
                        <p><strong>Peso:</strong> {peso.value}</p>
                        <p><strong>Z-score:</strong> {peso.zscore}</p>
                        <p><strong>Percentil:</strong> {peso.percentile}</p>
                        <p><strong>Clasificación:</strong> {peso.classification}</p>
                    </div>
                </details>
            )}

            {/* Altura para la edad */}
            {altura && (
                <details className="group rounded-xl border border-sky-100/80 bg-white/70 backdrop-blur p-0 shadow-sm transition">
                    <summary className="list-none flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full grid place-items-center bg-amber-100 text-amber-700">📐</div>
                            <span className="text-sm font-semibold tracking-tight text-sky-700">Altura para la edad</span>
                        </div>
                        <span className="text-xs text-gray-600 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 space-y-2">
                        <p><strong>Altura:</strong> {altura.value} cm</p>
                        <p><strong>Z-score:</strong> {altura.zscore}</p>
                        <p><strong>Percentil:</strong> {altura.percentile}</p>
                        <p><strong>Clasificación:</strong> {altura.classification}</p>
                    </div>
                </details>
            )}
        </div>
    );
};

export default ResultsCard;

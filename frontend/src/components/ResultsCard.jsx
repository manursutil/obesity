import IMCChart from "./IMCChart";

const ResultsCard = ({ results }) => {
    if (!results) return null;

    const imc = results.imc || null;
    const peso = results.peso_por_edad || null;
    const altura = results.altura_por_edad || null;
    const calorias = results.calorias || null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-md text-sm text-gray-800 hover:ring-1 hover:ring-sky-200 transition">
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">Resultados</h2>

            <IMCChart
                imc={results.imc}
                peso_por_edad={results.peso_por_edad}
                altura_por_edad={results.altura_por_edad}
            />


            {calorias && (
                <details open className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:ring-1 hover:ring-sky-300 transition-all hover:scale-[1.02]">
                    <summary className="cursor-pointer text-sm font-semibold text-sky-700 tracking-tight">
                        🍽️ Requerimiento calórico
                    </summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Tasa Metabólica Basal (Schofield):</strong> {calorias["TMB (Schofield)"]} kcal</p>
                        <p><strong>Tasa Metabólica Basal (OMS):</strong> {calorias["TMB (OMS)"]} kcal</p>
                        <p><strong>Gasto Energético Total (Schofield):</strong> {calorias["GET (Schofield)"]} kcal</p>
                        <p><strong>Gasto Energético Total (OMS):</strong> {calorias["GET (OMS)"]} kcal</p>
                        <p><strong>IMC:</strong> {calorias["IMC"]}</p>
                        <p><strong>Percentil IMC:</strong> {calorias["Percentil IMC"]}</p>
                        <p>
                            <strong>Clasificación:</strong>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${calorias["Clasificación OMS"] === "Normal"
                                ? "bg-green-100 text-green-800"
                                : calorias["Clasificación OMS"]?.includes("Sobrepeso")
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                {calorias["Clasificación OMS"]}
                            </span>
                        </p>
                        <p><strong>Actividad física:</strong> {calorias["Nivel de actividad"]}</p>
                        {calorias["Sugerencia"] && (
                            <p><strong>Sugerencia:</strong> {calorias["Sugerencia"]}</p>
                        )}
                    </div>
                </details>
            )}

            {imc && (
                <details className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:ring-1 hover:ring-sky-300 transition-all hover:scale-[1.02]">
                    <summary className="cursor-pointer text-md font-semibold text-sky-700 tracking-tight">
                        📏 IMC
                    </summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Valor:</strong> {imc.value}</p>
                        <p><strong>Z-score:</strong> {imc.zscore}</p>
                        <p><strong>Percentil:</strong> {imc.percentile}</p>
                        <p>
                            <strong>Clasificación:</strong>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${imc.classification === "Normal"
                                ? "bg-green-100 text-green-800"
                                : imc.classification?.includes("Sobrepeso")
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                {imc.classification}
                            </span>
                        </p>
                    </div>
                </details>
            )}

            {peso && (
                <details className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:ring-1 hover:ring-sky-300 transition-al hover:scale-[1.02]">
                    <summary className="cursor-pointer text-sm font-semibold text-sky-700 tracking-tight">
                        ⚖️ Peso para la edad
                    </summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Valor:</strong> {peso.value}</p>
                        <p><strong>Z-score:</strong> {peso.zscore}</p>
                        <p><strong>Percentil:</strong> {peso.percentile}</p>
                        <p><strong>Clasificación:</strong> {peso.classification}</p>
                    </div>
                </details>
            )}

            {altura && (
                <details className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:ring-1 hover:ring-sky-300 transition-all hover:scale-[1.02]">
                    <summary className="cursor-pointer text-sm font-semibold text-sky-700 tracking-tight">
                        📏 Altura para la edad
                    </summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Valor:</strong> {altura.value} cm</p>
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

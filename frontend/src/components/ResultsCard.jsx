const ResultsCard = ({ results }) => {
    if (!results) return null;

    const imc = results.imc || null;
    const peso = results.peso_por_edad || null;
    const altura = results.altura_por_edad || null;
    const calorias = results.calorias || null;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm hover:shadow transition text-sm text-gray-800">
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">Resultados</h2>

            {calorias && (
                <details open className="border border-gray-100 rounded-md p-4 bg-gray-50 transition hover:ring-1 hover:ring-gray-300">
                    <summary className="cursor-pointer text-sm font-medium text-gray-800">Requerimiento calórico</summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Tasa Metabólica Basal (Schofield):</strong> {calorias["TMB (Schofield)"]} kcal</p>
                        <p><strong>Tasa Metabólica Basal (OMS):</strong> {calorias["TMB (OMS)"]} kcal</p>
                        <p><strong>Gasto Energético Total (Schofield):</strong> {calorias["GET (Schofield)"]} kcal</p>
                        <p><strong>Gasto Energético Total (OMS):</strong> {calorias["GET (OMS)"]} kcal</p>
                        <p><strong>IMC:</strong> {calorias["IMC"]}</p>
                        <p><strong>Percentil IMC:</strong> {calorias["Percentil IMC"]}</p>
                        <p><strong>Clasificación:</strong> {calorias["Clasificación OMS"]}</p>
                        <p><strong>Actividad física:</strong> {calorias["Nivel de actividad"]}</p>
                        {calorias["Sugerencia"] && (
                            <p><strong>Sugerencia:</strong> {calorias["Sugerencia"]}</p>
                        )}
                    </div>
                </details>
            )}

            {imc && (
                <details className="border border-gray-100 rounded-md p-4 bg-gray-50 transition hover:ring-1 hover:ring-gray-300">
                    <summary className="cursor-pointer text-sm font-medium text-gray-800">IMC</summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Valor:</strong> {imc.value}</p>
                        <p><strong>Z-score:</strong> {imc.zscore}</p>
                        <p><strong>Percentil:</strong> {imc.percentile}</p>
                        <p><strong>Clasificación:</strong> {imc.classification}</p>
                    </div>
                </details>
            )}

            {peso && (
                <details className="border border-gray-100 rounded-md p-4 bg-gray-50 transition hover:ring-1 hover:ring-gray-300">
                    <summary className="cursor-pointer text-sm font-medium text-gray-800">Peso para la edad</summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>Valor:</strong> {peso.value}</p>
                        <p><strong>Z-score:</strong> {peso.zscore}</p>
                        <p><strong>Percentil:</strong> {peso.percentile}</p>
                        <p><strong>Clasificación:</strong> {peso.classification}</p>
                    </div>
                </details>
            )}

            {altura && (
                <details className="border border-gray-100 rounded-md p-4 bg-gray-50 transition hover:ring-1 hover:ring-gray-300">
                    <summary className="cursor-pointer text-sm font-medium text-gray-800">Altura para la edad</summary>
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

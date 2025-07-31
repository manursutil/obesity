const ResultsCard = ({ results }) => {
    if (!results) return null;

    const imc = results.imc || null;
    const peso = results.peso_por_edad || null;
    const altura = results.altura_por_edad || null;
    const calorias = results.calorias || null;

    return (
        <div>
            <h2>Resultados</h2>

            {imc && (
                <>
                    <h3>IMC</h3>
                    <p><strong>Valor:</strong> {imc.value}</p>
                    <p><strong>Z-score:</strong> {imc.zscore}</p>
                    <p><strong>Percentil:</strong> {imc.percentile}</p>
                    <p><strong>Clasificación:</strong> {imc.classification}</p>
                </>
            )}

            {peso && (
                <>
                    <h3>Peso por edad</h3>
                    <p><strong>Valor:</strong> {peso.value}</p>
                    <p><strong>Z-score:</strong> {peso.zscore}</p>
                    <p><strong>Percentil:</strong> {peso.percentile}</p>
                    <p><strong>Clasificación:</strong> {peso.classification}</p>
                </>
            )}

            {altura && (
                <>
                    <h3>Altura por edad</h3>
                    <p><strong>Valor:</strong> {altura.value} cm</p>
                    <p><strong>Z-score:</strong> {altura.zscore}</p>
                    <p><strong>Percentil:</strong> {altura.percentile}</p>
                    <p><strong>Clasificación:</strong> {altura.classification}</p>
                </>
            )}

            {calorias && (
                <>
                    <h3>Requerimiento calórico</h3>
                    <p><strong>TMB (Schofield):</strong> {calorias["TMB (Schofield)"]} kcal</p>
                    <p><strong>TMB (OMS):</strong> {calorias["TMB (OMS)"]} kcal</p>
                    <p><strong>GET (Schofield):</strong> {calorias["GET (Schofield)"]} kcal</p>
                    <p><strong>GET (OMS):</strong> {calorias["GET (OMS)"]} kcal</p>
                    <p><strong>IMC:</strong> {calorias["IMC"]}</p>
                    <p><strong>Percentil IMC:</strong> {calorias["Percentil IMC"]}</p>
                    <p><strong>Clasificación:</strong> {calorias["Clasificación OMS"]}</p>
                    <p><strong>Actividad física:</strong> {calorias["Nivel de actividad"]}</p>
                    {calorias["Sugerencia"] && (
                        <p><strong>Sugerencia:</strong> {calorias["Sugerencia"]}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ResultsCard;

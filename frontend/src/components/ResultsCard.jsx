const ResultsCard = ({ results }) => {
    if (!results) return null;

    const isCalories = "GET (OMS)" in results;

    return (
        <div>
            <h2>Resultados</h2>

            {isCalories ? (
                <>
                    <p><strong>TMB (Schofield):</strong> {results["TMB (Schofield)"]} kcal</p>
                    <p><strong>TMB (OMS):</strong> {results["TMB (OMS)"]} kcal</p>
                    <p><strong>GET (Schofield):</strong> {results["GET (Schofield)"]} kcal</p>
                    <p><strong>GET (OMS):</strong> {results["GET (OMS)"]} kcal</p>
                    <p><strong>IMC:</strong> {results["IMC"]}</p>
                    <p><strong>Percentil IMC:</strong> {results["Percentil IMC"]}</p>
                    <p><strong>Clasificación:</strong> {results["Clasificación OMS"]}</p>
                    {results.Sugerencia && <p><strong>Sugerencia:</strong> {results.Sugerencia}</p>}
                </>
            ) : (
                <>
                    <p><strong>Indicador:</strong> {results.type}</p>
                    <p><strong>Valor:</strong> {results.value}</p>
                    <p><strong>Z-score:</strong> {results.zscore}</p>
                    <p><strong>Percentil:</strong> {results.percentile}</p>
                    <p><strong>Clasificación:</strong> {results.classification}</p>
                </>
            )}
        </div>
    );
};

export default ResultsCard;

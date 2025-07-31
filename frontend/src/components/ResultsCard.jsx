const ResultsCard = ({ results }) => {
    if (!results) return null;

    return (
        <div>
            <h2>Resultados</h2>
            <p><strong>Indicador:</strong> {results.type}</p>
            <p><strong>Valor:</strong> {results.value}</p>
            <p><strong>Z-score:</strong> {results.zscore}</p>
            <p><strong>Percentil:</strong> {results.percentile}</p>
            <p><strong>Clasificación:</strong> {results.classification}</p>
        </div>
    );
};

export default ResultsCard;
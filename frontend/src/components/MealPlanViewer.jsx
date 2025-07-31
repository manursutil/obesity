const diasOrdenados = [
    "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
];


const MealPlanViewer = ({ plan }) => {
    if (!plan || !plan.plan) return null;

    return (
        <div>
            <h2>Plan alimenticio semanal</h2>
            {diasOrdenados.map((dia) => {
                const data = plan.plan[dia];
                if (!data) return null;

                return (
                    <div key={dia} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
                        <h3 style={{ textTransform: "capitalize" }}>{dia}</h3>
                        <p><strong>Calorías totales:</strong> {data.calorias_totales} kcal</p>

                        <p><strong>Macronutrientes:</strong></p>
                        <ul>
                            <li>Carbohidratos: {data.macros.carbohidratos} g</li>
                            <li>Proteínas: {data.macros.proteinas} g</li>
                            <li>Grasas: {data.macros.grasas} g</li>
                        </ul>

                        <p><strong>Comidas:</strong></p>
                        {Object.entries(data.comidas).map(([comida, items]) => (
                            <div key={comida} style={{ marginTop: "0.5rem" }}>
                                <strong style={{ textTransform: "capitalize" }}>{comida}:</strong>
                                <ul>
                                    {items.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default MealPlanViewer;
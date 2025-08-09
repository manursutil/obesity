import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const diasOrdenados = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
];

function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function formatMealItem(item) {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
        const nombre =
            item.alimento ?? item.nombre ?? item.item ?? item.plato ?? "Alimento";
        const qty =
            item.cantidad_g ?? item.cantidad ?? item.porcion ?? item.gramos ?? null;
        const kcal = item.kcal ?? item.calorias ?? null;

        const parts = [String(nombre)];
        if (qty != null) parts.push(`${qty}`);
        if (kcal != null) parts.push(`${kcal} kcal`);
        return parts.join(" — ");
    }
    return String(item ?? "");
}

const MealPlanViewer = ({ plan }) => {
    if (!plan || !plan.plan) return null;

    const exportPDF = () => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const marginX = 36;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - marginX * 2;

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Plan alimenticio semanal", marginX, 48);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const today = new Date();
        doc.text(
            `Generado: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
            marginX,
            64
        );

        let nextY = 84;

        const drawSeparator = () => {
            doc.setDrawColor(226);
            doc.line(marginX, nextY, pageWidth - marginX, nextY);
            nextY += 16;
        };

        diasOrdenados.forEach((dia, idx) => {
            const data = plan.plan[dia];
            if (!data) return;

            // Day title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.text(capitalize(dia), marginX, nextY);
            nextY += 14;

            // kcal line
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Kcal del día: ${data.calorias_totales ?? "-"}`, marginX, nextY);
            nextY += 8;

            // Macros table
            autoTable(doc, {
                startY: nextY,
                head: [["Macronutriente", "Cantidad (g)"]],
                body: [
                    ["Carbohidratos", data.macros?.carbohidratos ?? "-"],
                    ["Proteínas", data.macros?.proteinas ?? "-"],
                    ["Grasas", data.macros?.grasas ?? "-"],
                ],
                theme: "grid",
                styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
                headStyles: { fillColor: [225, 239, 254], textColor: 30 },
                margin: { left: marginX, right: marginX },
                tableWidth: contentWidth * 0.5,
            });
            nextY = (doc.lastAutoTable?.finalY || nextY) + 12;

            // Meals table
            const comidas = data.comidas || {};
            const mealsRows = Object.entries(comidas).map(([comida, items]) => {
                const lista = Array.isArray(items)
                    ? items.map(formatMealItem).join(" · ")
                    : "";
                return [capitalize(comida.replace("_", " ")), lista];
            });

            autoTable(doc, {
                startY: nextY,
                head: [["Comida", "Detalle"]],
                body: mealsRows,
                theme: "grid",
                styles: {
                    font: "helvetica",
                    fontSize: 10,
                    cellPadding: 6,
                    overflow: "linebreak",
                },
                columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: contentWidth - 120 } },
                headStyles: { fillColor: [209, 250, 229], textColor: 30 },
                margin: { left: marginX, right: marginX },
                tableWidth: contentWidth,
            });
            nextY = (doc.lastAutoTable?.finalY || nextY) + 18;

            // Separator between days
            if (idx < diasOrdenados.length - 1) {
                drawSeparator();
                // Add a page if close to the bottom
                if (nextY > pageHeight - 120) {
                    doc.addPage();
                    nextY = 48;
                }
            }
        });

        // Optional weekly total
        if (plan.total_calorias) {
            const y = (doc.lastAutoTable?.finalY || nextY) + 18;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(`Total semanal: ${plan.total_calorias} kcal`, marginX, y);
        }

        doc.save("plan_semanal.pdf");
    };

    return (
        <div className="space-y-5">
            {/* Title */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-sky-700">
                    📅 Plan alimenticio semanal
                </h2>

                <div className="flex items-center gap-2">
                    {plan.total_calorias && (
                        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 text-xs font-medium">
                            🔢 Total semanal: {plan.total_calorias} kcal
                        </span>
                    )}
                    <button
                        onClick={exportPDF}
                        className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow transition"
                    >
                        Descargar PDF
                    </button>
                </div>
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
                                    <div className="h-6 w-6 rounded-full grid place-items-center bg-sky-100 text-sky-700">
                                        🍽️
                                    </div>
                                    <h3 className="text-base font-medium text-sky-800 capitalize">
                                        {dia}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5">
                                        {data.calorias_totales ?? "-"} kcal
                                    </span>
                                    <span className="transition-transform group-open:rotate-180">⌄</span>
                                </div>
                            </summary>

                            {/* Content */}
                            <div className="px-4 pb-4 pt-1 space-y-4">
                                {/* Macros */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="rounded-lg border border-gray-200 bg-white/80 p-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            🧬 Macronutrientes
                                        </p>
                                        <ul className="text-sm text-gray-700 grid grid-cols-3 gap-2">
                                            <li className="rounded-md bg-sky-50 border border-sky-200 px-2 py-1 text-center">
                                                <span className="font-semibold">
                                                    {data.macros?.carbohidratos ?? "-"}
                                                </span>{" "}
                                                g
                                                <br />
                                                <span className="text-[11px] text-sky-700">Carbs</span>
                                            </li>
                                            <li className="rounded-md bg-teal-50 border border-teal-200 px-2 py-1 text-center">
                                                <span className="font-semibold">
                                                    {data.macros?.proteinas ?? "-"}
                                                </span>{" "}
                                                g
                                                <br />
                                                <span className="text-[11px] text-teal-700">Proteínas</span>
                                            </li>
                                            <li className="rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-center">
                                                <span className="font-semibold">
                                                    {data.macros?.grasas ?? "-"}
                                                </span>{" "}
                                                g
                                                <br />
                                                <span className="text-[11px] text-amber-700">Grasas</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Meals */}
                                <div className="rounded-lg border border-gray-200 bg-white/80 p-3">
                                    <p className="text-sm font-medium text-gray-700 mb-2">🍽️ Comidas</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Object.entries(data.comidas || {}).map(([comida, items]) => (
                                            <div
                                                key={comida}
                                                className="rounded-md bg-gray-50/80 border border-gray-200 p-3"
                                            >
                                                <strong className="capitalize text-sm text-gray-800">
                                                    {comida.replace("_", " ")}
                                                </strong>
                                                <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
                                                    {(Array.isArray(items) ? items : []).map((item, i) => (
                                                        <li key={i}>{formatMealItem(item)}</li>
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

import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";
import MealPlanViewer from "./components/MealPlanViewer";

const App = () => {
    const [results, setResults] = useState(null);
    const [mealplan, setMealplan] = useState(null);
    const [view, setView] = useState("form"); // "form" | "results"

    const handleComplete = ({ results, mealplan }) => {
        setResults(results);
        setMealplan(mealplan);
        setView("results");
    };

    const handleBack = () => {
        setResults(null);
        setMealplan(null);
        setView("form");
    };

    return (
        <div className="relative min-h-screen text-gray-800">
            {/* --- Soft background layers --- */}
            {/* Base soft gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
            {/* Gentle radial blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,theme(colors.sky.100/.6),transparent_40%),radial-gradient(circle_at_80%_30%,theme(colors.teal.100/.6),transparent_40%),radial-gradient(circle_at_50%_80%,theme(colors.pink.50/.5),transparent_40%)]" />
            {/* Subtle tech grid */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-15 [background-image:linear-gradient(to_right,transparent_0,transparent_31px,rgba(2,132,199,.08)_31px,rgba(2,132,199,.08)_32px),linear-gradient(to_bottom,transparent_0,transparent_31px,rgba(13,148,136,.08)_31px,rgba(13,148,136,.08)_32px)] [background-size:32px_32px]" />

            <header className="px-6 pt-10 pb-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 backdrop-blur px-3 py-1 text-xs">
                    <span>🩺</span>
                    <span className="uppercase tracking-wide text-sky-700">Pediatría</span>
                    <span>👶</span>
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                    Evaluación de Obesidad Infantil
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Calcula métricas de obesidad y genera un plan alimenticio adaptado.
                </p>
            </header>

            <main className="w-full max-w-4xl mx-auto px-4 pb-16">
                {view === "form" ? (
                    <div className="rounded-2xl border border-sky-100/80 bg-white/70 backdrop-blur-xl shadow-lg p-0 overflow-hidden">
                        {/* Card accent strip */}
                        <div className="h-1.5 bg-gradient-to-r from-sky-400 via-teal-400 to-sky-400" />
                        <div className="p-6">
                            <EvaluationForm onComplete={handleComplete} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-sky-100/80 bg-white/70 backdrop-blur-xl shadow-lg p-6">
                            <ResultsCard results={results} />
                        </div>
                        {mealplan && (
                            <div className="rounded-2xl border border-sky-100/80 bg-white/70 backdrop-blur-xl shadow-lg p-6">
                                <MealPlanViewer plan={mealplan} />
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center justify-center px-5 py-2 rounded-full font-medium border border-gray-300 bg-white/80 hover:bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
                            >
                                ← Volver
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;

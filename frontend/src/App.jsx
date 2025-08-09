import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";
import MealPlanViewer from "./components/MealPlanViewer";

const App = () => {
  const [results, setResults] = useState(null);
  const [mealplan, setMealplan] = useState(null);
  const [view, setView] = useState("form");

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
    <div className="relative min-h-screen text-gray-800 overflow-hidden">
      {/* vibrant pediatric background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-200 via-pink-50 to-teal-200" />

      {/* decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200 rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-28 w-72 h-72 bg-sky-300 rounded-full opacity-30 blur-3xl animate-pulse delay-150" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full opacity-30 blur-3xl animate-pulse delay-300" />

      <header className="px-6 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 backdrop-blur px-3 py-1 text-xs shadow-sm">
          <span>🩺</span>
          <span className="uppercase tracking-wide text-sky-700">Pediatría</span>
          <span>👶</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-teal-500 to-pink-500 bg-clip-text text-transparent">
          Evaluación de Obesidad Infantil
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Calcula métricas de obesidad y genera un plan alimenticio adaptado.
        </p>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 pb-16">
        {view === "form" ? (
          <div className="rounded-2xl border border-sky-100/80 bg-white/80 backdrop-blur-xl shadow-xl p-0 overflow-hidden">
            {/* card header strip */}
            <div className="h-1.5 bg-gradient-to-r from-sky-400 via-pink-400 to-teal-400" />
            <div className="p-6">
              <EvaluationForm onComplete={handleComplete} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-sky-100/80 bg-white/80 backdrop-blur-xl shadow-xl p-6">
              <ResultsCard results={results} />
            </div>
            {mealplan && (
              <div className="rounded-2xl border border-sky-100/80 bg-white/80 backdrop-blur-xl shadow-xl p-6">
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

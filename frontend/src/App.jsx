import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";
import MealPlanViewer from "./components/MealPlanViewer";

const App = () => {
  const [results, setResults] = useState(null);
  const [mealplan, setMealplan] = useState(null);
  const [activeTab, setActiveTab] = useState("resultados");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <h1 className="p-6 sm:p-8 text-2xl sm:text-3xl font-extrabold text-center text-sky-600 tracking-tight">
        Evaluación de Obesidad Infantil
      </h1>

      <main className="flex flex-col md:flex-row w-full px-4 py-6 gap-6">
        <div className="w-full md:w-1/2">
          <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:ring-1 hover:ring-sky-200 transition">
            <EvaluationForm onResult={setResults} onMealplan={setMealplan} />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            {["resultados", "plan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium border-b-2 rounded-t-md ${activeTab === tab
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-400 hover:text-sky-500"
                  }`}
              >
                {tab === "resultados" ? "📊 Resultados" : "🍽️ Plan alimenticio"}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "resultados" ? (
              results ? (
                <ResultsCard results={results} />
              ) : (
                <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-sm italic min-h-[300px]">
                  Los resultados se mostrarán aquí después de evaluar.
                </div>
              )
            ) : mealplan ? (
              <MealPlanViewer plan={mealplan} />
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-sm italic min-h-[300px]">
                El plan alimenticio aparecerá aquí después de generarlo.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";
import MealPlanViewer from "./components/MealPlanViewer";

const App = () => {
  const [results, setResults] = useState(null);
  const [mealplan, setMealplan] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <h1 className="p-6 sm:p-8 text-xl sm:text-2xl font-bold text-center">
        Evaluación de Obesidad Infantil
      </h1>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
            <EvaluationForm onResult={setResults} onMealplan={setMealplan} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {results ? (
            <ResultsCard results={results} />
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm italic min-h-[100px]">
              Los resultados se mostrarán aquí después de evaluar.
            </div>
          )}

          {mealplan ? (
            <MealPlanViewer plan={mealplan} />
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm italic min-h-[100px]">
              El plan alimenticio aparecerá aquí después de generarlo.
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default App;

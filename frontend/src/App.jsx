import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";
import MealPlanViewer from "./components/MealPlanViewer";

const App = () => {
  const [results, setResults] = useState(null);
  const [mealplan, setMealplan] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <h1 className="p-6 sm:p-8 text-xl sm:text-2xl font-bold text-center text-lg">
        Evaluación de Obesidad Infantil
      </h1>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6 md:flex-row md:overflow-hidden">
        <div className="w-full md:w-1/2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 w-full">
            <EvaluationForm onResult={setResults} onMealplan={setMealplan} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-6 overflow-y-auto px-1 md:px-0">
          <ResultsCard results={results} />
          <MealPlanViewer plan={mealplan} />
        </div>
      </main>
    </div>
  );
};

export default App;

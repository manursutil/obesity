import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";
import MealPlanViewer from "./components/MealPlanViewer";

const App = () => {
  const [results, setResults] = useState(null);
  const [mealplan, setMealplan] = useState(null);

  return (
    <div>
      <h1>Evaluación de Obesidad</h1>
      <EvaluationForm onResult={setResults} onMealplan={setMealplan} />
      <ResultsCard results={results} />
      <MealPlanViewer plan={mealplan} />
    </div>
  );
};

export default App;

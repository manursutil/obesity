import { useState } from "react";
import EvaluationForm from "./components/EvaluationForm";
import ResultsCard from "./components/ResultsCard";

const App = () => {
  const [results, setResults] = useState(null);

  return (
    <div>
      <h1>Evaluación de Obesidad</h1>
      <EvaluationForm onResult={setResults} />
      <ResultsCard results={results} />
    </div>
  );
};

export default App;

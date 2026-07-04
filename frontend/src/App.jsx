import { useState } from "react";
import Navbar from "./components/Navbar";
import PredictionForm from "./components/PredictionForm";
import ResultCard from "./components/ResultCard";

const initialForm = {
  amount: "",
  category: "shopping_pos",
  gender: "Female",
  age: "",
  city_pop: "",
  state: "NY",
  job: "",
  city: "",
  hour: "",
  distance: "",
};

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          age: Number(formData.age),
          city_pop: Number(formData.city_pop),
          hour: Number(formData.hour),
          distance: Number(formData.distance),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (submitError) {
      setError(
        "Could not reach the Flask API. Make sure the backend server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="content-grid">
        <section className="hero-card">
          <h1>Credit Card Fraud Detection System</h1>
          <p className="hero-copy">
            Enter a realistic transaction profile and let the trained model
            predict whether the pattern looks normal or fraudulent.
          </p>
          <div className="stats-row">
            <div>
              <span>Inputs</span>
              <strong>10 transaction features</strong>
            </div>
            <div>
              <span>Backend</span>
              <strong>Flask + XGBoost</strong>
            </div>
            <div>
              <span>Output</span>
              <strong>Prediction + risk report</strong>
            </div>
          </div>
        </section>

        <PredictionForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <ResultCard result={result} error={error} />
      </main>
    </div>
  );
}

export default App;

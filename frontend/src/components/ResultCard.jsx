function ResultCard({ result, error }) {
  if (error) {
    return (
      <section className="result-card">
        <h2>Prediction Result</h2>
        <p className="error-copy">{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="result-card">
        <h2>Prediction Result</h2>
        <p className="placeholder-copy">
          Submit a transaction to see the fraud prediction, confidence score,
          and risk report.
        </p>
      </section>
    );
  }

  const isFraud = result.prediction === 1;

  return (
    <section className={`result-card ${isFraud ? "fraud" : "normal"}`}>
      <div className={`badge ${isFraud ? "fraud" : "normal"}`}>
        {result.label}
      </div>
      <h2>{isFraud ? "Fraud Alert" : "Transaction Looks Normal"}</h2>
      <p>
        The model estimated a fraud probability of{" "}
        <strong>{(result.fraud_probability * 100).toFixed(2)}%</strong>.
      </p>

      <div className="result-meta">
        <div>
          <span>Model confidence</span>
          <strong>{(result.confidence * 100).toFixed(2)}%</strong>
        </div>
        <div>
          <span>Estimated distance</span>
          <strong>{Number(result.features_used.distance_km).toFixed(2)} km</strong>
        </div>
      </div>

      <h3>Risk Report</h3>
      <ul className="report-list">
        {result.report.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default ResultCard;

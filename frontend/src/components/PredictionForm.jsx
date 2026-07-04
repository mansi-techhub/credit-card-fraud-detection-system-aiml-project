const categories = [
  "shopping_pos",
  "shopping_net",
  "grocery_pos",
  "grocery_net",
  "gas_transport",
  "food_dining",
  "entertainment",
  "misc_pos",
  "misc_net",
  "health_fitness",
  "travel",
];

const states = [
  "CA",
  "FL",
  "IL",
  "NY",
  "NJ",
  "TX",
  "WA",
  "OH",
  "PA",
  "GA",
];

function PredictionForm({ formData, onChange, onSubmit, loading }) {
  return (
    <section className="form-card">
      <h2>Transaction Details</h2>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.amount}
              onChange={onChange}
              placeholder="2500"
            />
          </div>

          <div className="field-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={onChange}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="18"
              max="100"
              required
              value={formData.age}
              onChange={onChange}
              placeholder="28"
            />
          </div>

          <div className="field-group">
            <label htmlFor="city_pop">City Population</label>
            <input
              id="city_pop"
              name="city_pop"
              type="number"
              min="0"
              required
              value={formData.city_pop}
              onChange={onChange}
              placeholder="500000"
            />
          </div>

          <div className="field-group">
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={onChange}
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="job">Job</label>
            <input
              id="job"
              name="job"
              type="text"
              required
              value={formData.job}
              onChange={onChange}
              placeholder="Engineer"
            />
          </div>

          <div className="field-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={onChange}
              placeholder="New York City"
            />
          </div>

          <div className="field-group">
            <label htmlFor="hour">Transaction Hour</label>
            <input
              id="hour"
              name="hour"
              type="number"
              min="0"
              max="23"
              required
              value={formData.hour}
              onChange={onChange}
              placeholder="14"
            />
          </div>

          <div className="field-group">
            <label htmlFor="distance">Distance (km)</label>
            <input
              id="distance"
              name="distance"
              type="number"
              min="0"
              step="0.1"
              required
              value={formData.distance}
              onChange={onChange}
              placeholder="12.5"
            />
          </div>
        </div>

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Predict Fraud Risk"}
        </button>
      </form>
    </section>
  );
}

export default PredictionForm;

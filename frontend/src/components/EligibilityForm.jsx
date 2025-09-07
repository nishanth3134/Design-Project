import React, { useState } from "react";
import axios from "axios";

export default function EligibilityForm() {
  const [form, setForm] = useState({ age: "", gender: "any", income: "", occupation: "", state: "" });
  const [results, setResults] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const checkEligibility = async () => {
    try {
      const res = await axios.post("/api/eligibility/check", form);
      setResults(res.data.matches || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} /> <br />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="any">Any</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <br />
        <input name="income" placeholder="Income" value={form.income} onChange={handleChange} /> <br />
        <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} /> <br />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} /> <br />
        <button onClick={checkEligibility}>Check</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {results.length > 0 ? (
          results.map((s, idx) => (
            <div key={idx} style={{ border: "1px solid #ddd", padding: "0.5rem", marginBottom: "0.5rem" }}>
              <strong>{s.name}</strong>
              <p>{s.benefits}</p>
              <p>
                <a href={s.officialLink} target="_blank" rel="noreferrer">
                  Official Link
                </a>
              </p>
            </div>
          ))
        ) : (
          <p>No eligible schemes yet.</p>
        )}
      </div>
    </div>
  );
}

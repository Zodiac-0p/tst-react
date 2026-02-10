import { useMemo, useState } from "react";
import "./ProPlansPage.css";

export default function ProPlansPage() {
  const plans = useMemo(
    () => [
      {
        id: "monthly",
        name: "PRO Monthly",
        price: 199,
        period: "month",
        tag: "Best for trying",
        features: ["No Ads", "HD / 4K", "Downloads", "PRO Movies"],
      },
      {
        id: "quarterly",
        name: "PRO 3 Months",
        price: 499,
        period: "3 months",
        tag: "Most popular",
        highlight: true,
        features: ["No Ads", "HD / 4K", "Downloads", "PRO Movies", "Priority Support"],
      },
      {
        id: "yearly",
        name: "PRO Yearly",
        price: 1499,
        period: "year",
        tag: "Best value",
        features: ["No Ads", "HD / 4K", "Downloads", "PRO Movies", "Priority Support"],
      },
    ],
    []
  );

  const [selectedPlanId, setSelectedPlanId] = useState("yearly");

  // ✅ SIMPLE payment selection
  const [method, setMethod] = useState("UPI"); // UPI | CARD | NETBANKING
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [bank, setBank] = useState("SBI");

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const total = selectedPlan?.price ?? 0;

  const onPay = () => {
    // ✅ UI Demo only
    if (method === "UPI" && !upiId.trim()) {
      alert("Please enter your UPI ID (example: name@bank)");
      return;
    }
    if (method === "CARD") {
      const { number, name, exp, cvv } = card;
      if (!number || !name || !exp || !cvv) {
        alert("Please fill all card details");
        return;
      }
    }

    alert(
      `Payment started (demo)\nPlan: ${selectedPlan.name}\nMethod: ${method}\nAmount: ₹${total}`
    );
  };

  return (
    <div className="proplans-page">
      {/* ✅ Top header */}
      <div className="proplans-top">
        <div className="container">
          <div className="top-row">
            <div className="top-left">
              <div className="brand">
                <span className="dot" />
                <span className="brand-text">Flickify</span>
                <span className="pill">PRO</span>
              </div>

              <h1 className="title">Choose your PRO plan</h1>
              <p className="subtitle">No ads • Better quality • Downloads • PRO movies</p>
            </div>

            <div className="summary">
              <div className="summary-line">
                <span>Selected plan</span>
                <b>{selectedPlan?.name}</b>
              </div>
              <div className="summary-line">
                <span>Total</span>
                <b>₹{total}</b>
              </div>

              <button className="pay-btn" onClick={onPay}>
                Pay ₹{total}
              </button>

              <div className="hint">Demo UI • Integrate gateway later</div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main content */}
      <div className="container main">
        {/* ✅ Plans */}
        <section>
          <h2 className="section-title">Plans</h2>

          <div className="plan-grid">
            {plans.map((p) => {
              const active = p.id === selectedPlanId;

              return (
                <button
                  key={p.id}
                  type="button"
                  className={`plan-card ${active ? "active" : ""} ${p.highlight ? "highlight" : ""}`}
                  onClick={() => setSelectedPlanId(p.id)}
                >
                  <div className="plan-head">
                    <div>
                      <div className="plan-name">{p.name}</div>
                      <div className="plan-tag">{p.tag}</div>
                    </div>

                    <div className="plan-price">
                      <div className="price">₹{p.price}</div>
                      <div className="period">/ {p.period}</div>
                    </div>
                  </div>

                  <ul className="features">
                    {p.features.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>

                  <div className="select-hint">{active ? "Selected" : "Select plan"}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ✅ Simple Payment */}
        <section className="pay-section">
          <h2 className="section-title">Payment</h2>

          <div className="pay-grid">
            <button
              type="button"
              className={`pay-card ${method === "UPI" ? "active" : ""}`}
              onClick={() => setMethod("UPI")}
            >
              <div className="pay-card-title">UPI</div>
              <div className="pay-card-sub">Pay using UPI apps</div>
            </button>

            <button
              type="button"
              className={`pay-card ${method === "CARD" ? "active" : ""}`}
              onClick={() => setMethod("CARD")}
            >
              <div className="pay-card-title">Card</div>
              <div className="pay-card-sub">Debit / Credit</div>
            </button>

            <button
              type="button"
              className={`pay-card ${method === "NETBANKING" ? "active" : ""}`}
              onClick={() => setMethod("NETBANKING")}
            >
              <div className="pay-card-title">Net Banking</div>
              <div className="pay-card-sub">Pay via bank login</div>
            </button>
          </div>

          <div className="method-box simple">
            {method === "UPI" && (
              <div className="field">
                <label>UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example: sanju@okhdfcbank"
                />
              </div>
            )}

            {method === "CARD" && (
              <div className="grid2">
                <div className="field grid-full">
                  <label>Card Number</label>
                  <input
                    value={card.number}
                    onChange={(e) => setCard((p) => ({ ...p, number: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="field">
                  <label>Name on Card</label>
                  <input
                    value={card.name}
                    onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>

                <div className="field">
                  <label>Expiry</label>
                  <input
                    value={card.exp}
                    onChange={(e) => setCard((p) => ({ ...p, exp: e.target.value }))}
                    placeholder="MM/YY"
                  />
                </div>

                <div className="field">
                  <label>CVV</label>
                  <input
                    type="password"
                    value={card.cvv}
                    onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))}
                    placeholder="123"
                  />
                </div>
              </div>
            )}

            {method === "NETBANKING" && (
              <div className="field">
                <label>Select Bank</label>
                <select value={bank} onChange={(e) => setBank(e.target.value)}>
                  <option>SBI</option>
                  <option>HDFC</option>
                  <option>ICICI</option>
                  <option>AXIS</option>
                  <option>Federal Bank</option>
                  <option>Canara Bank</option>
                </select>
              </div>
            )}
          </div>

          <div className="bottom-pay">
            <div className="bottom-left">
              <div className="b1">
                Plan: <b>{selectedPlan?.name}</b>
              </div>
              <div className="b2">
                Method: <b>{method}</b>
              </div>
            </div>

            <button className="pay-btn big" onClick={onPay}>
              Pay ₹{total}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

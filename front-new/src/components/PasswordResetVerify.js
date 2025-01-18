import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";


const PasswordResetVerify = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/accounts/password/verify/", {
        code,
      });
      console.log(response, "response when success")
      setError("");
      navigate("/reset")
    } catch (err) {
      setError("Verification code is invalid or expired");
      setMessage("");
    }
  };

  return (
    <div className="form-container">
      <h2>Verify Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter reset code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="signupe">Verify</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PasswordResetVerify;

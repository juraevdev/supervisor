import React, { useState } from "react";
import { api } from "../api";

const ResendCode = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("api/v1/accounts/register/resend/code/", { phone_number: phoneNumber });
      setError("");
      console.log(response, "response when success")
    } catch (err) {
      setError("Failed to resend verification code. Please try again.");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Resend Verification Code</h2>
      <form onSubmit={handleResendCode}>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">Resend Code</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResendCode;

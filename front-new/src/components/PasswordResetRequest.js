import React, { useState } from "react";
import { api } from "../api";

const PasswordResetRequest = () => {
  const [phone_number, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("api/v1/accounts/password/request/", { phone_number });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Xatolik yuz berdi.");
    }
  };

  return (
    <div className="form-container">
      <h2>Parolni Tiklash So‘rovi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Telefon raqamingiz"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button type="submit">Kod Olish</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;

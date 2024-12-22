import React, { useState } from "react";
import { api } from "../api";
import './registerverify.css'

const RegisterVerify = () => {
  const [phone_number, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/v1/accounts/register/verify/", { phone_number, code });
      setMessage("Ro'yxatdan o'tish tasdiqlandi");
    } catch (error) {
      setMessage("Tasdiqlash kodi noto'g'ri yoki eski.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register Verification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="phone_number"
          placeholder="Telefon raqamingiz"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tasdiqlash kodi"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterVerify;

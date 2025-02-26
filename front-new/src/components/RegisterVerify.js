import React, { useState } from "react";
import { api } from "../api";
import "./registerverify.css";
import { Link, useNavigate } from "react-router-dom";

const RegisterVerify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/v1/accounts/register/verify/", { email, code });
      setMessage("Ro'yxatdan o'tish tasdiqlandi");
      navigate("/"); 
    } catch (error) {
      setMessage("Tasdiqlash kodi noto'g'ri yoki eski.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register Verification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tasdiqlash kodi"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="verify">
          Tasdiqlash
        </button>
        <Link to="/resend">
          <button type="button" className="resend">
            Kodni qayta jo'natish
          </button>
        </Link>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterVerify;
import React, { useState } from "react";
import { api } from "../api";
import "./registerverify.css";
import { Link, useNavigate } from "react-router-dom";

const RegisterVerify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await api.post("api/v1/accounts/register/verify/", { email, code });
      setMessage("Ro'yxatdan o'tish tasdiqlandi");
      navigate("/");
    } catch (error) {
      setMessage("Tasdiqlash kodi noto'g'ri yoki eski.");
    } finally {
      setLoading(false);
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
        <button type="submit" className="signupe" disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Tasdiqlash"}
        </button>
        <Link to="/resend">
          <button type="submit" className="signupe" disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Kodni qayta yuborish"}
          </button>
        </Link>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterVerify;
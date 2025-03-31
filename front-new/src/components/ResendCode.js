import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email kiritish shart")
    .email("Yaroqli email kiriting"),
});

const ResendCode = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleResendCode = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await api.post("api/v1/accounts/register/resend/code/", {
        email: data.email,
      });

      setMessage(response.data.message);
      navigate("/register/verify");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Foydalanuvchi topilmadi.");
      } else {
        setError("Tasdiqlash kodini yuborishda xatolik yuz berdi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleResendCode)}>
        <div>
          <input
            type="email"
            placeholder="Emailingizni kiriting"
            {...register("email")}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>
        <button type="submit" className="resend" disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Tasdiqlash kodini yuborish"}
        </button>
      </form>
      {message && <div style={{ color: "green", marginTop: "10px" }}>{message}</div>}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default ResendCode;

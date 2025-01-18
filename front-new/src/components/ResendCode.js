import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Telefon raqam kiritish shart")
    .matches(/^\+998[0-9]{9}$/, "Telefon raqam formati +998XXXXXXXXX bo'lishi kerak"),
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
        phone_number: data.phone_number,
      });

      setMessage(response.data.message);
      navigate("/register/verify"); // Sahifaga yo'naltirish
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
            type="text"
            placeholder="Telefon raqamni kiriting"
            {...register("phone_number")}
          />
          {errors.phone_number && <p style={{ color: "red" }}>{errors.phone_number.message}</p>}
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

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
    .email("Email noto'g'ri formatda"),
});

const PasswordResetRequest = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleResetRequest = async (data) => {
    try {
      const response = await api.post("api/v1/accounts/password/request/", {
        email: data.email,
      });

      alert("Emailingizga tasdiqlash kodi yuborildi!");
      navigate("/verify");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Foydalanuvchi topilmadi.");
      } else {
        setError("Tasdiqlash kodini yuborishda xatolik yuz berdi.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Parolni Tiklash So‘rovi</h2>
      <form onSubmit={handleSubmit(handleResetRequest)}>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>
        <button type="submit" className="signupe">Kod olish</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default PasswordResetRequest;

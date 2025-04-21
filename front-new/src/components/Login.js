import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../services/api";
import { Link } from 'react-router-dom';


const schema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Telefon raqam kiritish shart")
    .matches(/^\+998[0-9]{9}$/, "Telefon raqam formati +998() bo'lishi kerak"),
    password: yup
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .required("Parol kiritish shart"),
});

const Login = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [apiError, setApiError] = React.useState("");

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const response = await loginUser(data);
      localStorage.setItem("access", response?.data?.access)
      localStorage.setItem("refresh", response?.data?.refresh)
      console.log(response)
      navigate("/");
    } catch (error) {
      setApiError(error.response?.data?.detail || "Login xatosi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="form-container">
      {/* Kirish sahifasiga link */}
      
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Telefon raqam */}
        <input {...register("phone_number")} placeholder="Telefon raqam +998()" />
        <p>{errors.phone_number?.message}</p>

        <input {...register("password")} type="password" placeholder="Parol" />
        <p>{errors.password?.message}</p>

        <button type="submit" className="signupe" disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Login"}
        </button>
        {apiError && <p className="error">{apiError}</p>}
        <a href="/request" className="request">Parol esdan chiqdimi?</a>
        <p className="sign">Akkountingiz yo'qmi?</p>
        <Link to="/sign-up" className="nav-linke">Ro'yxatdan o'tish</Link>
      </form>
    </div>
  );
};

export default Login;

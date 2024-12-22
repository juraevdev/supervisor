import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom"; 
import './register.css';


const schema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Telefon raqam kiritish shart")
    .matches(/^\+998[0-9]{9}$/, "Telefon raqam formati +998() bo'lishi kerak"),
  first_name: yup.string().required("Ism kiritish shart"),
  email: yup.string().email("Email noto'g'ri").required("Email kiritish shart"),
  password: yup
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    .required("Parol kiritish shart"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Parollar mos emas")
    .required("Parolni tasdiqlash shart"),
});

const Register = () => {
  const navigate = useNavigate(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      alert("Ro'yxatdan o'tish muvaffaqiyatli!");
      navigate("/register/verify");
    } catch (error) {
      console.error(error.response?.data || "Serverda xatolik yuz berdi");
      alert("Xatolik yuz berdi. Iltimos, qayta urining.");
    }
  };

  return (
    <div className="form-container">
      {/* Kirish sahifasiga link */}
      
      <h2>Ro'yxatdan o'tish</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Telefon raqam */}
        <input {...register("phone_number")} placeholder="Telefon raqam (+998XXXXXXXXX)" />
        <p>{errors.phone_number?.message}</p>

        {/* Ism */}
        <input {...register("first_name")} placeholder="Ism" />
        <p>{errors.first_name?.message}</p>

        {/* Email */}
        <input {...register("email")} placeholder="Email" />
        <p>{errors.email?.message}</p>

        {/* Parol */}
        <input {...register("password")} type="password" placeholder="Parol" />
        <p>{errors.password?.message}</p>

        {/* Parolni tasdiqlash */}
        <input
          {...register("confirm_password")}
          type="password"
          placeholder="Parolni tasdiqlang"
        />
        <p>{errors.confirm_password?.message}</p>

        {/* Tugma */}
        <button type="submit" className="signupe">Ro'yxatdan o'tish</button>
        <a href="sign-in" className="nav-link">Kirish</a>
      </form>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { api } from "../api";

function Reset() {
    const [formData, setFormData] = useState({
        phone_number: "",
        new_password: "",
        confirm_password: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         const response = await api.post("/api/v1/accounts/password/reset/", formData);
         console.log(response, "response when success")
        //  setMessage("Login muvaffaqiyatli amalga oshirildi!");
        //  localStorage.setItem("access", response.data.access);
        //  localStorage.setItem("refresh", response.data.refresh);
       } catch (error) {
         alert("Tasdiqlash kodi noto'g'ri yoki eski.");
       }
     };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="phone_number"
                    placeholder="Telefon raqamingiz"
                    value={formData.phone_number}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="new_password"
                    placeholder="yangi parol"
                    value={formData.new_password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="confirm_password"
                    placeholder="yangi parol yana "
                    value={formData.confirm_password}
                    onChange={handleChange}
                />
                <button type="submit">submit</button>
            </form>
        </div>
    )
}
export default Reset
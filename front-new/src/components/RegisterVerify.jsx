import React, { useState, useRef, useEffect } from "react";
import { api } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const CODE_LENGTH = 5;

export default function RegisterVerify() {
  const [email, setEmail] = useState("");
  const [codeArray, setCodeArray] = useState(Array(CODE_LENGTH).fill(""));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Expecting email passed via router state
    if (!location.state?.email) {
      // If no email, return to registration
      navigate("/register", { replace: true });
      return;
    }
    setEmail(location.state.email);
    inputsRef.current[0]?.focus();
  }, [location.state, navigate]);

  const handleChange = (e, idx) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;

    const newCodes = [...codeArray];
    newCodes[idx] = value;
    setCodeArray(newCodes);

    if (value && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !codeArray[idx] && idx > 0) {
      const prev = inputsRef.current[idx - 1];
      prev?.focus();
      setCodeArray(arr => {
        const copy = [...arr];
        copy[idx - 1] = '';
        return copy;
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().slice(0, CODE_LENGTH);
    if (!/^[0-9]+$/.test(paste)) return;
    const pastedArr = paste.split('');
    const newCodes = [...codeArray];
    pastedArr.forEach((digit, i) => {
      newCodes[i] = digit;
      if (inputsRef.current[i]) inputsRef.current[i].value = digit;
    });
    setCodeArray(newCodes);
    const focusIndex = pastedArr.length >= CODE_LENGTH ? CODE_LENGTH - 1 : pastedArr.length;
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = codeArray.join('');
    if (code.length < CODE_LENGTH) {
      setMessage("Iltimos, to‘liq kodni kiriting");
      return;
    }

    setLoading(true);
    try {
      await api.post("api/v1/accounts/register/verify/", { email, code });
      setMessage("Ro'yxatdan o'tish tasdiqlandi");
      navigate('/login', { replace: true });
    } catch (error) {
      setMessage("Tasdiqlash kodi noto'g'ri yoki eski.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        onPaste={handlePaste}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-4 rounded-lg border border-gray-800 bg-gray-950/50 p-6 sm:p-8 shadow-lg"
      >
        <p className="text-center text-gray-400">
          {`Verifikatsiya kodi ${email} manziliga yuborildi.`}
        </p>
        <div className="grid grid-cols-5 gap-2 justify-items-center">
          {codeArray.map((num, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              ref={el => inputsRef.current[idx] = el}
              value={num}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded border border-gray-700 bg-gray-800 text-center text-lg sm:text-xl text-white"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? 'Yuklanmoqda...' : 'Tasdiqlash'}
        </button>

        {message && <p className="text-center text-sm text-gray-400">{message}</p>}

        <p className="text-center text-sm text-gray-400">
          Kod kelmadimi?{' '}
          <Link to={"/resend"}>
          <button
            type="button"
            className="text-emerald-400 hover:underline no-underline focus:no-underline cursor-pointer"
          >
            Qayta yuborish
          </button>
          </Link>
        </p>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../utils/api";

export default function ProfileDetails() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response.data);
      } catch {
        setError("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-gray-950/50 p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold text-white">Profil ma'lumotlari</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Ism</span>
            <span className="text-white">{userData.first_name || "Not Available"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Familiya</span>
            <span className="text-white">{userData.last_name || "Not Available"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{userData.email || "Not Available"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Telefon</span>
            <span className="text-white">{userData.phone_number || "Not Available"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

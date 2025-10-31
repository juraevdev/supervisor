import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loginUser } from "../services/api";

// Validation schema
const schema = z.object({
  phone_number: z.string()
    .regex(/^\+998[0-9]{9}$/, "Telefon raqam formati +998XXXXXXXXX bo'lishi kerak")
    .nonempty("Telefon raqam kiritish shart"),
  password: z.string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    .nonempty("Parol kiritish shart"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phone_number: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      // Store tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      toast.success("Kirish muvaffaqiyatli", { description: "Siz tizimga kirdingiz" });
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.detail || "Login xatosi. Qayta urinib ko'ring.";
      form.setError("phone_number", { type: "manual", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Login</h1>
          <p className="text-sm text-gray-400">Telefon raqam va parolingiz bilan kiring</p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-6 sm:p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Telefon raqam</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="+998901234567"
                        className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Parol</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Parol"
                        className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Yuklanmoqda..." : "Kirish"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col space-y-2 text-center">
            <Link to="/request" className="text-sm text-gray-400 hover:underline">
              Parol esdan chiqdimi?
            </Link>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm text-gray-400">Akkountingiz yo'qmi?</span>
              <Link to="/register" className="text-emerald-400 hover:underline text-sm">
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

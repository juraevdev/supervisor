import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "../api";

// Validation schema
const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  new_password: z.string()
    .min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  confirm_password: z.string(),
}).refine(data => data.new_password === data.confirm_password, {
  path: ["confirm_password"],
  message: "Parollar mos kelmaydi",
});

export default function PasswordResetForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/api/v1/accounts/password/reset/", data);
      toast.success("Parol muvaffaqiyatli yangilandi");
      form.reset();
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.detail || "Xatolik yuz berdi. Qayta urinib ko'ring.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Parolni yangilash</h1>
          <p className="text-sm text-gray-400">Telefon raqam va yangi parolni kiriting</p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-6 sm:p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
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
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Yangi parol</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Yangi parol"
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
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Parolni tasdiqlang</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Yangi parolni qayta kiriting"
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
                {isLoading ? "Yuklanmoqda..." : "Yangilash"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col space-y-2 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:underline">
              Kirish sahifasiga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

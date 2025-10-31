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
  email: z.string().email({ message: "Email noto'g'ri formatda" }),
});

export default function PasswordResetRequestForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("api/v1/accounts/password/request/", {
        email: data.email,
      });
      toast.success("Kod yuborildi!", { description: "Emailingizga tasdiqlash kodi yuborildi." });
      form.reset();
      navigate("/verify", { state: { email: data.email } });
    } catch (error) {
      if (error.response?.status === 404) {
        form.setError("email", { type: "manual", message: "Foydalanuvchi topilmadi." });
      } else {
        toast.error("Xatolik! Qayta urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Parolni tiklash</h1>
          <p className="text-sm text-gray-400">Email manzilingizni kiriting</p>
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
                        placeholder="email@example.com"
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
                {isLoading ? "Yuklanmoqda..." : "Kod olish"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col space-y-2 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:underline">
              Kirishga qaytish
            </Link>
            <Link to="/register" className="text-sm text-emerald-400 hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

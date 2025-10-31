import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  code: z.string().min(1, "Verification code is required"),
});

export default function PasswordResetVerifyForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Extract email passed via state
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      // Redirect back if no email
      navigate("/password-reset", { replace: true });
    }
  }, [email, navigate]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });

  const onSubmit = async ({ code }) => {
    setIsLoading(true);
    try {
      await api.post("/api/v1/accounts/password/verify/", { email, code });
      toast.success("Kod tasdiqlandi!", { description: "Endi yangi parol o‘rnating." });
      form.reset();
      navigate("/reset", { state: { email } });
    } catch (error) {
      const message = error.response?.data?.detail || "Verification code is invalid or expired";
      form.setError("code", { type: "manual", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Parolni tiklashni tasdiqlash</h1>
          <p className="text-sm text-gray-400">
            {`Email: ${email ?? "-"} uchun yuborilgan kodni kiriting`}
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-6 sm:p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Tasdiqlash kodi</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Kodni kiriting"
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
                {isLoading ? "Yuklanmoqda..." : "Tasdiqlash"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col space-y-2 text-center">
            <Link to="/request" className="text-sm text-gray-400 hover:underline">
              So‘rov sahifasiga qaytish
            </Link>
            <Link to="/login" className="text-sm text-emerald-400 hover:underline">
              Kirishga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

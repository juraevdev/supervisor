import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { api } from "../api"

// Validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function ResendCode() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await api.post("api/v1/accounts/register/resend/code/", { email: data.email })
      toast.success(response.data.message || "Verification code sent!")
      form.reset()
      navigate("/register/verify", { state: { email: data.email } })
    } catch (error) {
      if (error.response?.status === 404) {
        form.setError("email", { type: "manual", message: "User not found." })
      } else {
        toast.error("Error sending verification code. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Resend verification code</h1>
          <p className="text-sm text-gray-400">Enter your email to receive a new verification code</p>
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

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend code"}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              asChild
            >
              <Link to="/register" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to registration
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerUser } from "../services/api"
import { toast } from "sonner"

// Schema validation
const formSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  phone_number: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

export default function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast.success("Account created!", {
        description: "You've successfully registered an account.",
      })
      form.reset()
      // Use absolute path and pass email in state
      navigate("/register/verify", { state: { email: data.email } })
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Create an account</h1>
          <p className="text-sm text-gray-400">Enter your details below to create an account</p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-6 sm:p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">First name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
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
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Last name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Phone number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="+1 (555) 000-0000"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
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
                    <FormLabel className="text-gray-300">Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
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
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-950/50 px-2 text-gray-400">Already have an account?</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

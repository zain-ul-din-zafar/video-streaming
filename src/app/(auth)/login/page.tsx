"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";
import { fireAuth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { PasswordInput } from "@/components/ui/password-input";
import { useTransition } from "react";

// password: 2uT2S4CAHt83KLj

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "invalid password")
});

export default function Login() {
  const [user] = useAuthState(fireAuth);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const [loading, startTransition] = useTransition();

  if (user) return redirect(ROUTES.admin);

  return (
    <div className="w-full h-[100svh]">
      <main className="flex flex-col items-center justify-center h-full">
        <section className="border p-6 rounded-md sm:w-[26rem] w-[90%] space-y-8">
          <h1 className="text-center text-lg font-bold">Login</h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                startTransition(async () => {
                  await new Promise((resolve) => {
                    createUserWithEmailAndPassword(
                      fireAuth,
                      data.email,
                      data.password
                    )
                      .then(() => resolve(true))
                      .catch((err) => {
                        if (err.code === "auth/email-already-in-use") {
                          signInWithEmailAndPassword(
                            fireAuth,
                            data.email,
                            data.password
                          )
                            .then(() => resolve(true))
                            .catch(() => {
                              resolve(true);
                              form.setError("password", {
                                message: "Invalid email or password"
                              });
                            });
                        }
                      });
                  });
                });
              })}
              className="space-y-4"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="Enter email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <PasswordInput
                      placeholder="Enter password"
                      {...field}
                      autoComplete="new-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.password && form.getValues().email && (
                <div className="flex justify-end">
                  <Button
                    size={"sm"}
                    variant={"link"}
                    onClick={() => {
                      sendPasswordResetEmail(
                        fireAuth,
                        form.getValues().email
                      ).then(() => {
                        alert("Password reset email sent");
                      });
                    }}
                  >
                    Forget password
                  </Button>
                </div>
              )}
              <div className="flex pt-4">
                <Button type="submit" className="w-full " isLoading={loading}>
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </section>
      </main>
    </div>
  );
}

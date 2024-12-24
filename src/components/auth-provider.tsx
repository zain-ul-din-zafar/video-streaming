"use client";
import { fireAuth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./shared/loader";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ROUTES } from "@/lib/constants";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading] = useAuthState(fireAuth);

  if (loading) return <Loader />;

  if (!user) redirect(ROUTES.login);

  return <>{children}</>;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Login or Register" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/account");
  return <LoginClient />;
}

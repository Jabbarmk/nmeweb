"use client";

import { useActionState, useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { requestOtp, verifyOtp, type ActionResult } from "@/app/actions";
import { SubmitButton } from "@/components/form";

/**
 * Two-step email OTP flow (v2 auth): request a code, then verify it.
 * The API distinguishes register vs login OTPs, so the toggle matters —
 * a registered email must use Login, a new one must use Register.
 */
export default function LoginClient() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [requestState, requestAction, requestPending] = useActionState<ActionResult | null, FormData>(
    async (prev, formData) => {
      const res = await requestOtp(mode, prev, formData);
      if (res.ok) {
        setEmail(String(formData.get("email") ?? "").trim());
        setOtpSent(true);
      }
      return res;
    },
    null,
  );

  const [verifyState, verifyAction, verifyPending] = useActionState<ActionResult | null, FormData>(verifyOtp, null);

  return (
    <main className="mx-auto flex max-w-md flex-col items-center px-4 py-12">
      <Logo className="h-20 w-20" />
      <h1 className="mt-4 text-2xl font-bold text-ink">{otpSent ? "Enter the code" : "Welcome to N-ME"}</h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        {otpSent
          ? `We sent a 6-digit code to ${email}. It's valid for 5 minutes.`
          : "Log in or create an account with your email — no password needed."}
      </p>

      <div className="mt-8 w-full rounded-3xl bg-white p-6 shadow-sm">
        {!otpSent ? (
          <>
            <div className="mb-5 flex rounded-full bg-gray-100 p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize ${
                    mode === m ? "bg-white text-brand shadow-sm" : "text-gray-500"
                  }`}
                >
                  {m === "login" ? "Log in" : "Register"}
                </button>
              ))}
            </div>

            <form action={requestAction} className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-brand">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full text-sm outline-none"
                  />
                </div>
              </label>
              {requestState && !requestState.ok && (
                <p className="text-sm font-medium text-rose-600">{requestState.message}</p>
              )}
              <SubmitButton pending={requestPending} label="Send OTP" pendingLabel="Sending…" />
            </form>
          </>
        ) : (
          <form action={verifyAction} className="space-y-4">
            <input type="hidden" name="email" value={email} />
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">6-digit code</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-brand">
                <KeyRound className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••••"
                  className="w-full text-lg font-bold tracking-[0.5em] outline-none"
                />
              </div>
            </label>
            {verifyState && !verifyState.ok && (
              <p className="text-sm font-medium text-rose-600">{verifyState.message}</p>
            )}
            <SubmitButton pending={verifyPending} label="Verify & continue" pendingLabel="Verifying…" />
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="block w-full text-center text-xs font-semibold text-gray-500 hover:text-brand"
            >
              Use a different email or resend the code
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

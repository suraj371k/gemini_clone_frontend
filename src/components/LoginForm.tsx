"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CountrySelect from "./CountrySelect";
import { useAuthStore } from "@/store/authStore";
import { phoneSchema, otpSchema } from "@/schema/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function LoginForm() {
  const { sendOtp, otp, setUser, user, clearOtp } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "done">("phone");
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    code: string;
  } | null>(null);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: "", dialCode: "", phone: "" },
    mode: "onBlur",
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (selectedCountry) {
      phoneForm.setValue("country", selectedCountry.name);
      phoneForm.setValue("dialCode", selectedCountry.code);
    }
  }, [selectedCountry, phoneForm]);

  const handleSendOtp = (values: PhoneFormValues) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const phoneWithDial = `${values.dialCode}${values.phone}`;
    sendOtp(phoneWithDial, code, 120000);
    setStep("otp");
    toast.success(`OTP sent to ${phoneWithDial}`);
  };

  const handleVerifyOtp = (values: OtpFormValues) => {
    if (!otp) return;
    if (otp.code !== values.otp) {
      otpForm.setError("otp", { message: "Invalid OTP" });
      return;
    }
    const user = { phone: otp.phoneWithDial };
    setUser(user);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch {}
    clearOtp();
    toast.success("Logged in successfully");
    router.push("/chatrooms");
  };

  useEffect(() => {
    // if already logged in, redirect
    if (user) {
      router.push("/chatrooms");
    }
  }, [user, router]);

  if (step === "done") {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! You&apos;re now logged in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {step === "phone" ? "Welcome Back" : "Verify Your Phone"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {step === "phone"
              ? "Enter your phone number to get started"
              : "We've sent a verification code to your phone"}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        {step === "phone" && (
          <form
            className="space-y-5"
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Country
                </Label>
                <CountrySelect onChange={(v) => setSelectedCountry(v)} />
                {(phoneForm.formState.errors.country ||
                  phoneForm.formState.errors.dialCode) && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    Select a country
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Phone Number
                </Label>
                <div className="flex gap-3">
                  <div className="relative w-28">
                    <Input
                      className="py-5 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center font-medium"
                      readOnly
                      value={phoneForm.watch("dialCode")}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      id="phone"
                      className="py-5 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234567890"
                      {...phoneForm.register("phone")}
                    />
                  </div>
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200"
            >
              Send Verification Code
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form
            className="space-y-5"
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  className="py-5 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-semibold"
                  placeholder="0000"
                  maxLength={4}
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              {otp && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
                    Test OTP:{" "}
                    <span className="font-mono font-bold">{otp.code}</span>
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200"
            >
              Verify & Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

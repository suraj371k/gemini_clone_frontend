"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CountrySelect from "./CountrySelect";
import { useAuthStore } from "@/store/authStore";
import { phoneSchema, otpSchema, signupSchema } from "@/schema/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Mail,
  User,
  Lock,
} from "lucide-react";
import Link from "next/link";

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const { sendOtp, otp, setUser, clearOtp } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState<"details" | "phone" | "otp" | "done">(
    "details"
  );
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const detailsForm = useForm<Pick<SignupFormValues, "name" | "email">>({
    resolver: zodResolver(signupSchema.pick({ name: true, email: true })),
    defaultValues: { name: "", email: "" },
    mode: "onChange", // Changed to onChange for real-time validation
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: "", dialCode: "", phone: "" },
    mode: "onChange", // Changed to onChange for real-time validation
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onChange", // Changed to onChange for real-time validation
  });

  useEffect(() => {
    if (selectedCountry) {
      phoneForm.setValue("country", selectedCountry.name);
      phoneForm.setValue("dialCode", selectedCountry.code);
    }
  }, [selectedCountry, phoneForm]);

  const handleSendOtp = async (values: PhoneFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const phoneWithDial = `${values.dialCode}${values.phone}`;
    sendOtp(phoneWithDial, code, 120000);
    setStep("otp");
    toast.success(`OTP sent to ${phoneWithDial}`);
    setIsLoading(false);
  };

  const handleVerifyOtp = async (values: OtpFormValues) => {
    if (!otp) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (otp.code !== values.otp) {
      otpForm.setError("otp", { message: "Invalid OTP" });
      setIsLoading(false);
      return;
    }

    const name = detailsForm.getValues("name");
    const email = detailsForm.getValues("email");
    const phoneWithDial = otp.phoneWithDial;
    const user = { name, email, phone: phoneWithDial };
    setUser(user);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch {}

    clearOtp();
    toast.success("Registration successful");
    setIsLoading(false);
    setStep("done");
  };

  // Progress steps
  const steps = [
    { id: "details", title: "Account Details" },
    { id: "phone", title: "Phone Verification" },
    { id: "otp", title: "Verify OTP" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  if (step === "done") {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-900/30 flex items-center justify-center shadow-md">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Registration Complete!
          </h2>
          <p className="text-gray-400 mb-6">
            Your account has been successfully created.
          </p>
          <Button
            className="w-full py-5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 transform hover:scale-105"
            onClick={() => router.push("/login")}
          >
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="flex justify-between items-center mb-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  i <= currentStepIndex
                    ? "text-blue-400"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                    i < currentStepIndex
                      ? "border-blue-400 bg-blue-400 text-white"
                      : i === currentStepIndex
                      ? "border-blue-400"
                      : "border-gray-600"
                  } transition-all duration-300`}
                >
                  {i < currentStepIndex ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-1 hidden sm:inline">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 sm:w-12 mx-2 ${
                    i < currentStepIndex ? "bg-blue-400" : "bg-gray-600"
                  } transition-all duration-300`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        {step === "details" && (
          <form
            className="space-y-5"
            onSubmit={detailsForm.handleSubmit(() => setStep("phone"))}
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Create Account
              </h2>
              <p className="text-gray-400">
                Enter your details to get started
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-300"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    className="pl-10 py-5 rounded-lg bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                    {...detailsForm.register("name")}
                  />
                </div>
                {detailsForm.formState.errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {detailsForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-300"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 py-5 rounded-lg bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="john@example.com"
                    {...detailsForm.register("email")}
                  />
                </div>
                {detailsForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {detailsForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full py-5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                !detailsForm.formState.isValid || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-purple-700"
              }`}
              disabled={!detailsForm.formState.isValid || isLoading}
              aria-disabled={!detailsForm.formState.isValid || isLoading}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Log in
              </Link>
            </p>
          </form>
        )}

        {step === "phone" && (
          <form
            className="space-y-5"
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
          >
            <div>
              <button
                type="button"
                className="flex items-center text-sm text-gray-400 hover:text-gray-100 mb-4 transition-colors"
                onClick={() => setStep("details")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </button>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Phone Verification
              </h2>
              <p className="text-gray-400">
                We'll send a verification code to your phone
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">
                  Country
                </Label>
                <CountrySelect onChange={(v) => setSelectedCountry(v)} />
                {(phoneForm.formState.errors.country ||
                  phoneForm.formState.errors.dialCode) && (
                  <p className="text-red-400 text-sm mt-1">
                    Select a country
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-gray-300"
                >
                  Phone Number
                </Label>
                <div className="flex gap-3">
                  <div className="relative w-28">
                    <Input
                      className="pl-10 py-5 rounded-lg bg-gray-800 border-gray-700 text-gray-200"
                      readOnly
                      value={phoneForm.watch("dialCode")}
                    />
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <Input
                      id="phone"
                      className="py-5 rounded-lg bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="1234567890"
                      {...phoneForm.register("phone")}
                    />
                  </div>
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full py-5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                !phoneForm.formState.isValid || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-purple-700"
              }`}
              disabled={!phoneForm.formState.isValid || isLoading}
              aria-disabled={!phoneForm.formState.isValid || isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Log in
              </Link>
            </p>
          </form>
        )}

        {step === "otp" && (
          <form
            className="space-y-5"
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
          >
            <div>
              <button
                type="button"
                className="flex items-center text-sm text-gray-400 hover:text-gray-100 mb-4 transition-colors"
                onClick={() => setStep("phone")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </button>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-400">
                We've sent a 4-digit code to your phone
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-gray-300"
                >
                  Verification Code
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="otp"
                    inputMode="numeric"
                    className="pl-10 py-5 rounded-lg bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-semibold transition-all duration-300"
                    placeholder="0000"
                    maxLength={4}
                    {...otpForm.register("otp")}
                  />
                </div>
                {otpForm.formState.errors.otp && (
                  <p className="text-red-400 text-sm mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              {otp && (
                <div className="p-3 bg-blue-900/20 rounded-lg">
                  <p className="text-blue-300 text-sm text-center">
                    Test OTP:{" "}
                    <span className="font-mono font-bold">{otp.code}</span>
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className={`w-full py-5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                !otpForm.formState.isValid || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-purple-700"
              }`}
              disabled={!otpForm.formState.isValid || isLoading}
              aria-disabled={!otpForm.formState.isValid || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Create Account"}
            </Button>
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, KeyRound, Lock } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Enter new password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] bg-white border border-slate-200/60 p-10 rounded-[32px] shadow-2xl shadow-slate-200/50 z-10 transition-all duration-300">

        {/* Step Indicator */}
        <div className="flex justify-center mb-8 gap-4">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                step === num
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Dynamic Heading */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {step === 1 && "Reset Your Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Create New Password"}
          </h2>
          <p className="text-sm text-slate-500">
            {step === 1 && "Enter your registered email to receive a secure OTP."}
            {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
            {step === 3 && "Set a new secure password for your account."}
          </p>
        </div>

        {/* Step Content */}
        <div className="space-y-4 transition-all duration-300">

          {step === 1 && (
            <>
              <div className="relative">
                <Mail className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>

              <Button
                onClick={handleRequestOTP}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Send OTP"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="relative">
                <KeyRound className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 h-12 rounded-xl tracking-widest text-center text-lg"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify OTP"}
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="relative">
                <Lock className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Reset Password"}
              </Button>
            </>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-8 text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
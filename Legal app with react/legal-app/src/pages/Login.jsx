import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, Github, Chrome, Apple } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Login successful!");

      const path = data.role === "lawyer" ? "/lawyer/dashboard" : "/dashboard";
      navigate(path);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background: Added a subtle animated mesh gradient
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />

      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="bg-black p-3 rounded-2xl shadow-xl shadow-blue-900/10">
          <svg viewBox="0 0 76 65" fill="#fff" className="w-10 h-10">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"></path>
          </svg>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
            Enterprise Secure
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[440px] bg-white border border-slate-200/60 p-10 rounded-[32px] shadow-2xl shadow-slate-200/50 z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Access your secure legal dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative group">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-4 transition-all"
              />
            </div>

            <div className="relative group">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-4 transition-all"
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                //onClick={() => alert("clicked")}
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] text-base font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Sign In to LegalPro"
            )}
          </Button>
        </form>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            <span className="bg-white px-4">Instant Access</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <SocialIconButton icon={<Chrome className="w-5 h-5" />} />
          <SocialIconButton icon={<Github className="w-5 h-5" />} />
          <SocialIconButton icon={<Apple className="w-5 h-5" />} />
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-slate-500 font-medium">
            New to the firm?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Request Access
            </button>
          </p>
        </div>
      </div>

      <footer className="mt-8 text-slate-400 text-[11px] font-medium tracking-wide">
        &copy; 2026 LegalPro Management Systems. AES-256 Encrypted.
      </footer>
    </div>
  );
}

function SocialIconButton({ icon }) {
  return (
    <Button
      variant="outline"
      className="h-14 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all active:scale-95"
    >
      <div className="text-slate-600">{icon}</div>
    </Button>
  );
}

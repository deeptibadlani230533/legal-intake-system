import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ShieldCheck, UserPlus, Mail, Lock, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-6">
      
      {/* Decorative Background Elements (Matching Login) */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-100/50 rounded-full blur-[120px]" />

      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="bg-black p-3 rounded-2xl shadow-xl shadow-blue-900/10 cursor-pointer" onClick={() => navigate("/login")}>
          <svg viewBox="0 0 76 65" fill="#fff" className="w-8 h-8">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"></path>
          </svg>
        </div>
      </div>

      <Card className="w-full max-w-[480px] bg-white border-slate-200/60 p-4 rounded-[32px] shadow-2xl shadow-slate-200/50 z-10 animate-in fade-in zoom-in-95 duration-700">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-2">
            <UserPlus className="text-blue-600 w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Join LegalPro to manage your cases securely
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="John Doe"
                    className="h-12 pl-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 pl-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Secure Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 pl-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Account Type</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => setForm({ ...form, role: value })}
                >
                  <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="client">Client / Petitioner</SelectItem>
                    <SelectItem value="lawyer">Professional Lawyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] text-base font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Complete Registration"}
            </Button>

            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <footer className="mt-8 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <ShieldCheck className="w-3 h-3" />
        Verified Legal Infrastructure
      </footer>
    </div>
  );
}
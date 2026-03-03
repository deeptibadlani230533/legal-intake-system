import React, { useState } from "react";
import { User, Shield, Bell, Trash2, Globe, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const role = localStorage.getItem("role");

  return (
    <main className="flex-1 bg-white min-h-screen">
      {/* Constrained container for that 'centered' look */}
      <div className="max-w-250 mx-auto px-6 py-12 space-y-12">
        
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your firm account and notification preferences.</p>
        </header>

        <Separator className="bg-slate-100" />

        {/* Section: Profile */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">General</h2>
            <p className="text-sm text-slate-500">Your basic identity and firm role.</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Account Role</Label>
                <Input value={role || "User"} disabled className="bg-slate-50 border-slate-200 capitalize" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Timezone</Label>
                <Input value="Asia/Kolkata (GMT+5:30)" disabled className="bg-slate-50 border-slate-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Display Name</Label>
              <Input placeholder="Enter your name" className="h-11 border-slate-200 focus:border-black" />
            </div>
            <Button className="bg-black text-white px-6">Save Changes</Button>
          </div>
        </section>

        <Separator className="bg-slate-100" />

        {/* Section: Security */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Security</h2>
            <p className="text-sm text-slate-500">Protect your account with modern standards.</p>
          </div>
          <div className="md:col-span-2 space-y-6 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">Two-factor Authentication</p>
                <p className="text-xs text-slate-500">Secure your account with an extra layer of protection.</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">Password</p>
                <p className="text-xs text-slate-500">Last changed 4 months ago.</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </section>

        <Separator className="bg-slate-100" />

        {/* Section: Danger Zone */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-1">Danger Zone</h2>
            <p className="text-sm text-slate-500">Irreversible actions for your account.</p>
          </div>
          <div className="md:col-span-2 border border-red-200 bg-red-50/30 rounded-xl p-6 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-red-900">Delete Account</p>
              <p className="text-xs text-red-700">Permanently remove all cases and access.</p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Briefcase, LayoutDashboard, PlusCircle, Settings, Users, ShieldCheck } from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Ensure you have this shadcn component
import NotificationBell from "../components/NotificationBell";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "user";
  const closeTimeout = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = role === "lawyer" ? "/lawyer/dashboard" : "/dashboard";

  // Logic for the Role Badge Colors
  const roleStyles = {
    admin: "bg-red-50 text-red-700 border-red-100",
    lawyer: "bg-blue-50 text-blue-700 border-blue-100",
    client: "bg-emerald-50 text-emerald-700 border-emerald-100",
    user: "bg-slate-50 text-slate-700 border-slate-100",
  };

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const navLinks = [
    { name: "Dashboard", path: dashboardPath, icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Case Directory", path: "/cases", icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Brand & Nav */}
          <div className="flex items-center gap-10">
            <Link to={dashboardPath} className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-slate-900">LegalPro</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                      isActive 
                      ? "text-blue-600 bg-blue-50/50" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-[21px] left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions, Bell & Profile (ALL IN ONE FLEX BOX) */}
          <div className="flex items-center gap-3">
            
            {/* New Case Button */}
            {role === "client" && (
              <Button
                size="sm"
                onClick={() => navigate("/intake")}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Case
              </Button>
            )}

            {/* Notification Bell Component */}
            <NotificationBell />

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* Profile Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full bg-slate-100 border border-slate-200 p-0 overflow-hidden hover:bg-slate-200 transition-colors focus-visible:ring-0"
                  >
                    <UserCircle className="w-6 h-6 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 mt-2 animate-in fade-in slide-in-from-top-2 duration-200 ease-out shadow-2xl"
                  onMouseEnter={handleMouseEnter}
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold leading-none text-slate-900">Account Profile</p>
                        {/* THE ROLE BADGE */}
                        <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 ${roleStyles[role]}`}>
                          {role}
                        </Badge>
                      </div>
                      <p className="text-xs leading-none text-slate-500 italic">Connected to LegalPro Secure</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer py-2.5">
                    <Settings className="w-4 h-4 mr-2 text-slate-400" /> Account Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/team")} className="cursor-pointer py-2.5">
                    <Users className="w-4 h-4 mr-2 text-slate-400" /> Team Directory
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-bold py-2.5" 
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
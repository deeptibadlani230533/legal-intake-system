import React, { useEffect, useState } from "react";
import { User, Mail, Shield, ShieldCheck, UserCog, MoreHorizontal, UserPlus } from "lucide-react";
import Header from "../components/Header.jsx";

// shadcn components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Team() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load users");
          return;
        }
        setUsers(data);
      } catch (err) {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Helper to get initials for Avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-screen">
      <Header title="Personnel Directory">
        <Button size="sm" className="bg-black text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </Header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
            {error}
          </div>
        )}

        <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white rounded-xl">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-20 py-4 px-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest">ID</TableHead>
                <TableHead className="py-4 px-6 text-slate-900 font-bold uppercase text-[10px] tracking-widest">Member</TableHead>
                <TableHead className="py-4 px-6 text-slate-900 font-bold uppercase text-[10px] tracking-widest">Role</TableHead>
                <TableHead className="py-4 px-6 text-right text-slate-900 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    Syncing firm database...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                    <TableCell className="px-6 font-mono text-xs text-slate-400">
                      #{user.id}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge 
                        variant="outline" 
                        className={`capitalize px-2.5 py-0.5 font-medium border-0 ${
                          user.role === 'admin' 
                            ? "bg-blue-50 text-blue-700" 
                            : user.role === 'lawyer' 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                        {user.role === 'lawyer' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">Management</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <UserCog className="w-4 h-4 mr-2" /> Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                            <Mail className="w-4 h-4 mr-2" /> Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
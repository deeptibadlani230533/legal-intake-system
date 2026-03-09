import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  ShieldCheck,
  MoreHorizontal,
  UserPlus,
  Trash2,
  Activity,
  Search,
  ChevronDown,
} from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const deleteUser = async (userId) => {
    const currentUserId = localStorage.getItem("userId");
    if (userId === Number(currentUserId)) {
      alert("You cannot delete your own account.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        alert("Failed to delete user");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert("Server error while deleting user");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-screen">
      <Header title="Personnel Directory">
        <Button size="sm" className="bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-sm transition-all px-4">
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </Header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            {/* Styled Search Bar */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-full sm:w-80 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all shadow-sm"
              />
            </div>

            {/* Styled Custom Select */}
            <div className="relative group">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer shadow-sm min-w-[130px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="lawyer">Lawyer</option>
                <option value="client">Client</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <Card className="border-slate-200/60 shadow-md shadow-slate-200/50 overflow-hidden bg-white rounded-2xl">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-100">
                <TableHead className="w-24 py-4 px-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Internal ID
                </TableHead>
                <TableHead className="py-4 px-6 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                  Member Profile
                </TableHead>
                <TableHead className="py-4 px-6 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                  Authorization
                </TableHead>
                <TableHead className="py-4 px-6 text-right text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                  Options
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-5 w-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                      <p className="text-xs font-medium tracking-tight">Syncing firm database...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="group hover:bg-slate-50/40 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <TableCell className="px-6 font-mono text-[11px] text-slate-400">
                      #{String(user.id).padStart(4, '0')}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                          <AvatarFallback className="bg-slate-900 text-white text-[11px] font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                          <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-500 font-medium leading-none">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className={`capitalize h-7 px-3 font-semibold text-[10px] tracking-wide border-0 flex items-center w-fit gap-1.5 rounded-lg shadow-sm ${
                          user.role === "admin"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                            : user.role === "lawyer"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                        }`}
                      >
                        {user.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                        {user.role === "lawyer" && <Shield className="w-3 h-3" />}
                        {user.role === "client" && <User className="w-3 h-3" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-slate-200">
                          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            Account Actions
                          </DropdownMenuLabel>
                          
                          <div className="my-1 border-t border-slate-100" />
                          <DropdownMenuItem
                            disabled={user.role === "admin"}
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg py-2 font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            <span className="text-sm">Restrict Access</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!loading && filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-400 font-medium">No firm members found matching your search.</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
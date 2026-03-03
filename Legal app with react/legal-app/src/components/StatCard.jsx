import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <motion.div
      whileHover={{ y: -4 }} // Smoothly lifts the card up
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="relative group overflow-hidden border-slate-200/60 bg-white p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)]">
        
        {/* Subtle Background Glow Effect */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-2xl" />

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
            
            {trend && (
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>{trend} vs last month</span>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-slate-500 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
            <Icon size={20} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
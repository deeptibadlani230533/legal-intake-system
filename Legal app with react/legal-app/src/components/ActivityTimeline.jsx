import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ActivityTimeline({ caseId,refreshKey }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchActivity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/cases/${caseId}/activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch activity");

        setActivity(data);
      } catch (err) {
        toast.error("Failed to load case activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [caseId,refreshKey]);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Case Activity
        </CardTitle>
        <CardDescription>
          Chronological system activity for this case
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500 animate-pulse">
            Loading activity...
          </p>
        ) : activity.length === 0 ? (
          <p className="text-sm text-slate-500">
            No activity recorded yet.
          </p>
        ) : (
          activity.map((log, index) => (
            <div key={log.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute left-0 top-2 w-2 h-2 bg-blue-600 rounded-full" />

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {log.action.replaceAll("_", " ")}
                </p>

                {log.details && (
                  <p className="text-xs text-slate-600">
                    {log.details}
                  </p>
                )}

                <p className="text-xs text-slate-400">
                  By {log.user?.name} ({log.user?.role}) •{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>

              {index !== activity.length - 1 && (
                <div className="absolute left-1 top-6 bottom-0 w-px bg-slate-200" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
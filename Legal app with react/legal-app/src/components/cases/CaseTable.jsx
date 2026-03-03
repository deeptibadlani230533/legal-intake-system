import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, UserPlus, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";

export default function CaseTable({
  cases,
  loading,
  role,
  onView,
  onAssignClick,
  onArchiveClick,
  onCreate,
}) {
  const statusStyles = {
    open: "border-emerald-200 bg-emerald-50 text-emerald-700",
    assigned: "border-amber-200 bg-amber-50 text-amber-700",
    in_progress: "border-blue-200 bg-blue-50 text-blue-700",
    closed: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Matter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead className="text-right">Options</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-20">
                Loading...
              </TableCell>
            </TableRow>
          ) : cases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState role={role} onCreate={onCreate} />
              </TableCell>
            </TableRow>
          ) : (
            cases.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.caseTitle}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize border ${statusStyles[item.status]}`}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(item.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      {role === "admin" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onAssignClick(item)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onArchiveClick(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
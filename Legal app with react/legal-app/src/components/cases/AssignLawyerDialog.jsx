import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AssignLawyerDialog({
  open,
  onOpenChange,
  lawyers,
  selectedLawyer,
  setSelectedLawyer,
  onAssign,
  isAssigning,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Assign Lawyer</DialogTitle>

        <DialogDescription>
          Select a lawyer to assign this case.
        </DialogDescription>

        <div className="mt-4">
          <Select value={selectedLawyer} onValueChange={setSelectedLawyer}>
            <SelectTrigger>
              <SelectValue placeholder="Select lawyer" />
            </SelectTrigger>
            <SelectContent>
              {lawyers.length > 0 ? (
                lawyers.map((lawyer) => (
                  <SelectItem
                    key={lawyer.id}
                    value={String(lawyer.id)}
                  >
                    {lawyer.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-500">
                  No lawyers available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onAssign} disabled={isAssigning}>
            {isAssigning ? "Assigning..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pill, Check, X } from "lucide-react";
import { stopContinuousSound } from "@/utils/notifications";
import { useMedications } from "@/context/MedicationContext";

interface MedicationReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicationId: string;
  medicationName: string;
  dosage: string;
  instructions?: string;
}

const MedicationReminderDialog: React.FC<MedicationReminderDialogProps> = ({
  open,
  onOpenChange,
  medicationId,
  medicationName,
  dosage,
  instructions,
}) => {
  const { markMedicationTaken } = useMedications();

  const handleTaken = () => {
    markMedicationTaken(medicationId);
    stopContinuousSound();
    onOpenChange(false);
  };

  const handleDecline = () => {
    stopContinuousSound();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10 text-primary">
            <Pill className="h-10 w-10" />
          </div>
          <DialogTitle className="text-xl">Time to take your medication</DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="block text-lg font-semibold text-foreground">{medicationName}</span>
            <span className="block mt-1">{dosage}</span>
            {instructions && <span className="block mt-1 text-sm opacity-80">{instructions}</span>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-4 mt-4">
          <Button variant="outline" onClick={handleDecline} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
          <Button onClick={handleTaken} className="flex-1">
            <Check className="mr-2 h-4 w-4" />
            Taken
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationReminderDialog;

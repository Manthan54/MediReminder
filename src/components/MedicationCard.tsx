
import React, { useState } from 'react';
import { Clock, Check, Bell, Edit, Trash } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  frequency: string;
  instructions?: string;
}

interface MedicationCardProps {
  medication: Medication;
  onMarkTaken: (id: string) => void;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onMarkTaken,
  onEdit,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const handleMarkTaken = () => {
    onMarkTaken(medication.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`glass-card overflow-hidden ${medication.taken ? 'opacity-75' : ''}`}
      >
        <CardContent className="p-0">
          <div className="relative">
            {/* Color accent top bar */}
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{medication.name}</h3>
                    {medication.taken && (
                      <span className="pill-badge bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400 animate-fade-in">
                        <Check className="w-3 h-3 mr-1" />
                        Taken
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{medication.dosage}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{medication.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {medication.frequency}
                  </div>
                </div>
              </div>
              
              {medication.instructions && (
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>{medication.instructions}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 border-t border-border/50 flex justify-between">
          {!medication.taken ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs font-medium flex-1 hover:border-green-500 hover:text-green-600 transition-colors"
              onClick={handleMarkTaken}
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Mark as Taken
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground flex-1"
              onClick={handleMarkTaken}
            >
              <div className="w-3.5 h-3.5 mr-1.5" />
              Undo
            </Button>
          )}
          
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(medication)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(medication.id)}
            >
              <Trash className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medication } from '@/components/MedicationCard';
import { 
  scheduleNotification, 
  showNotification, 
  requestNotificationPermission,
  playNotificationSound,
  startContinuousSound,
  stopContinuousSound
} from '@/utils/notifications';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import MedicationReminderDialog from '@/components/MedicationReminderDialog';

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'taken'>) => void;
  updateMedication: (id: string, medication: Omit<Medication, 'id' | 'taken'>) => void;
  deleteMedication: (id: string) => void;
  markMedicationTaken: (id: string) => void;
  getTodayMedications: () => Medication[];
  getScheduledNotifications: () => Record<string, number>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

interface MedicationProviderProps {
  children: React.ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notificationTimeouts, setNotificationTimeouts] = useState<Record<string, number>>({});
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  
  // State for the reminder dialog
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Medication | null>(null);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    // Request notification permission on component mount
    if (!hasRequestedPermission) {
      requestNotificationPermission().then((granted) => {
        setHasRequestedPermission(true);
        if (granted) {
          scheduleMedicationNotifications();
          
          // Test notification with sound to verify it works
          setTimeout(() => {
            showNotification(
              'Medication Reminder Setup',
              { 
                body: 'You will now receive alerts when it\'s time to take your medication',
                data: { url: '/' }
              }
            );
            // Explicitly play sound to test
            playNotificationSound();
          }, 1000);
          
          toast.success('Notification permissions granted! You will receive reminders when medications are due.', {
            duration: 5000,
          });
        } else {
          toast.warning('Please enable notifications to receive medication reminders', {
            duration: 5000,
          });
        }
      });
    }
  }, [hasRequestedPermission]);

  useEffect(() => {
    // Clear existing notification timeouts
    Object.values(notificationTimeouts).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    
    // Schedule new notifications
    if (Notification.permission === 'granted') {
      scheduleMedicationNotifications();
    }
  }, [medications]); // Re-schedule when medications change

  const scheduleMedicationNotifications = () => {
    const newTimeouts: Record<string, number> = {};
    
    medications.forEach(medication => {
      if (medication.taken) return; // Skip already taken medications
      
      const [hours, minutes] = medication.time.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If time has already passed today, don't schedule
      if (scheduledTime.getTime() < Date.now()) return;
      
      const timeUntilNotification = scheduledTime.getTime() - Date.now();
      
      console.log(`Scheduling notification for ${medication.name} in ${timeUntilNotification / 1000} seconds`);
      
      // Schedule the notification with sound and dialog
      const timeoutId = window.setTimeout(() => {
        console.log(`Triggered notification for ${medication.name}`);
        
        // Show the system notification
        const notification = showNotification(
          `Time to take ${medication.name}`,
          {
            body: `${medication.dosage} - ${medication.instructions || 'Take as directed'}`,
            data: { 
              url: '/',
              onAccept: () => markMedicationTaken(medication.id)
            },
            requireInteraction: true // Keep notification until user interacts with it
          }
        );
        
        // Start continuous sound playing
        startContinuousSound();
        
        // Show toast notification
        toast.info(`Time to take ${medication.name}`, {
          duration: 10000,
        });
        
        // Show the dialog
        setCurrentReminder(medication);
        setReminderDialogOpen(true);
      }, timeUntilNotification);
      
      // For testing, if a medication is due within the next minute, set a test notification
      if (timeUntilNotification < 60000 && timeUntilNotification > 0) {
        console.log(`Setting test notification for ${medication.name} in 5 seconds`);
        setTimeout(() => {
          console.log(`Test notification for ${medication.name}`);
          
          // Show the system notification
          showNotification(
            `Time to take ${medication.name}`,
            {
              body: `${medication.dosage} - ${medication.instructions || 'Take as directed'}`,
              data: { 
                url: '/',
                onAccept: () => markMedicationTaken(medication.id)
              },
              requireInteraction: true
            }
          );
          
          // Start continuous sound playing
          startContinuousSound();
          
          // Show the dialog
          setCurrentReminder(medication);
          setReminderDialogOpen(true);
        }, 5000); // Show test notification after 5 seconds
      }
      
      newTimeouts[medication.id] = timeoutId;
    });
    
    setNotificationTimeouts(newTimeouts);
  };

  const addMedication = (medication: Omit<Medication, 'id' | 'taken'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      taken: false,
    };
    
    setMedications(prev => [...prev, newMedication]);
    toast.success(`Added ${medication.name} to your medication list`);
    
    // Request notification permission again if not granted
    if (Notification.permission !== 'granted') {
      requestNotificationPermission();
    }
  };

  const updateMedication = (id: string, medication: Omit<Medication, 'id' | 'taken'>) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...medication, id, taken: med.taken } 
          : med
      )
    );
    toast.success(`Updated ${medication.name}`);
  };

  const deleteMedication = (id: string) => {
    const medicationToDelete = medications.find(med => med.id === id);
    
    // Clear notification timeout if it exists
    if (notificationTimeouts[id]) {
      clearTimeout(notificationTimeouts[id]);
      const newTimeouts = { ...notificationTimeouts };
      delete newTimeouts[id];
      setNotificationTimeouts(newTimeouts);
    }
    
    setMedications(prev => prev.filter(med => med.id !== id));
    
    if (medicationToDelete) {
      toast.success(`Removed ${medicationToDelete.name} from your medication list`);
    }
  };

  const markMedicationTaken = (id: string) => {
    setMedications(prev => 
      prev.map(med => {
        if (med.id === id) {
          const newTakenStatus = !med.taken;
          
          // Show notification when marking as taken
          if (newTakenStatus) {
            toast.success(`Marked ${med.name} as taken`);
            // Stop any active sound if this was from a reminder
            stopContinuousSound();
          } else {
            toast.info(`Unmarked ${med.name}`);
          }
          
          return { ...med, taken: newTakenStatus };
        }
        return med;
      })
    );
  };

  const getTodayMedications = () => {
    return medications.filter(med => {
      // For simplicity, return all medications
      // In a real app, you would filter by date
      return true;
    });
  };

  const getScheduledNotifications = () => {
    return notificationTimeouts;
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        markMedicationTaken,
        getTodayMedications,
        getScheduledNotifications,
      }}
    >
      {children}
      
      {/* Medication Reminder Dialog */}
      {currentReminder && (
        <MedicationReminderDialog
          open={reminderDialogOpen}
          onOpenChange={setReminderDialogOpen}
          medicationId={currentReminder.id}
          medicationName={currentReminder.name}
          dosage={currentReminder.dosage}
          instructions={currentReminder.instructions}
        />
      )}
    </MedicationContext.Provider>
  );
};

export const useMedications = (): MedicationContextType => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};

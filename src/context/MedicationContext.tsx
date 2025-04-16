
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
import { useAuth } from '@/context/AuthContext';

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
  const { session } = useAuth();
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notificationTimeouts, setNotificationTimeouts] = useState<Record<string, number>>({});
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Medication | null>(null);

  // Stop any continuous sound when the component mounts or unmounts
  useEffect(() => {
    stopContinuousSound();
    return () => stopContinuousSound();
  }, []);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Only request permissions when user is authenticated
  useEffect(() => {
    if (session && !hasRequestedPermission) {
      requestNotificationPermission().then((granted) => {
        setHasRequestedPermission(true);
        if (granted) {
          scheduleMedicationNotifications();
          
          setTimeout(() => {
            showNotification(
              'Medication Reminder Setup',
              { 
                body: 'You will now receive alerts when it\'s time to take your medication',
                data: { url: '/' }
              }
            );
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
  }, [hasRequestedPermission, session]);

  // Clear and reset all notification timeouts when medications change
  useEffect(() => {
    // Make sure to stop any continuous sounds
    stopContinuousSound();
    
    // Clear any existing timeouts
    Object.values(notificationTimeouts).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    
    // Only schedule new notifications if user is logged in and has granted permission
    if (session && Notification.permission === 'granted') {
      scheduleMedicationNotifications();
    }
    
    return () => {
      stopContinuousSound();
      Object.values(notificationTimeouts).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, [medications, session]);

  const scheduleMedicationNotifications = () => {
    // Don't schedule if not authenticated
    if (!session) return;
    
    const newTimeouts: Record<string, number> = {};
    
    medications.forEach(medication => {
      if (medication.taken) return;
      
      const [hours, minutes] = medication.time.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      if (scheduledTime.getTime() < Date.now()) return;
      
      const timeUntilNotification = scheduledTime.getTime() - Date.now();
      
      console.log(`Scheduling notification for ${medication.name} in ${timeUntilNotification / 1000} seconds`);
      
      const timeoutId = window.setTimeout(() => {
        console.log(`Triggered notification for ${medication.name}`);
        
        const notification = showNotification(
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
        
        startContinuousSound();
        
        toast.info(`Time to take ${medication.name}`, {
          duration: 10000,
        });
        
        setCurrentReminder(medication);
        setReminderDialogOpen(true);
      }, timeUntilNotification);
      
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
          
          if (newTakenStatus) {
            toast.success(`Marked ${med.name} as taken`);
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medication } from '@/components/MedicationCard';
import { 
  scheduleNotification, 
  showNotification, 
  requestNotificationPermission,
  playNotificationSound
} from '@/utils/notifications';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
          // Show a test notification to ensure it's working
          showNotification(
            'Medication Reminder Setup',
            { 
              body: 'You will now receive alerts when it\'s time to take your medication',
              data: { url: '/' }
            }
          );
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
      
      // Schedule the notification
      const timeoutId = scheduleNotification(
        `Time to take ${medication.name}`,
        {
          body: `${medication.dosage} - ${medication.instructions || 'Take as directed'}`,
          data: { url: '/' },
          requireInteraction: true // Keep notification until user interacts with it
        },
        timeUntilNotification
      );
      
      // Also schedule an immediate test notification if it's coming up soon (within 10 seconds)
      // This is for testing purposes
      if (timeUntilNotification <= 10000 && timeUntilNotification > 0) {
        setTimeout(() => {
          showNotification(
            `Time to take ${medication.name}`,
            {
              body: `${medication.dosage} - ${medication.instructions || 'Take as directed'}`,
              data: { url: '/' },
              requireInteraction: true
            }
          );
          playNotificationSound();
        }, 2000); // Show test notification after 2 seconds
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

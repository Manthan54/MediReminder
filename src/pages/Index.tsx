
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MedicationCard } from '@/components/MedicationCard';
import { AddMedicationForm } from '@/components/AddMedicationForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, Info, AlertCircle } from 'lucide-react';
import { useMedications } from '@/context/MedicationContext';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { motion } from 'framer-motion';

const Index = () => {
  const { 
    getTodayMedications, 
    markMedicationTaken, 
    updateMedication, 
    deleteMedication,
    addMedication
  } = useMedications();
  
  const [openAddForm, setOpenAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  
  const todayMedications = getTodayMedications();
  const pendingMedications = todayMedications.filter(med => !med.taken);
  const takenMedications = todayMedications.filter(med => med.taken);

  const handleEdit = (medication: any) => {
    setEditingMedication(medication);
    setOpenAddForm(true);
  };

  const handleSaveMedication = (medication: any) => {
    if (editingMedication) {
      updateMedication(editingMedication.id, medication);
      setEditingMedication(null);
    } else {
      addMedication(medication);
    }
  };

  const getTimeDisplay = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours < 12) {
      return 'Good Morning';
    } else if (hours < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl text-muted-foreground font-light">{getTimeDisplay()}</h2>
          <h1 className="text-3xl font-semibold mt-1">{getFormattedDate()}</h1>
        </motion.div>
        
        <div className="grid gap-6">
          {pendingMedications.length === 0 && takenMedications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-card">
                <CardContent className="pt-6 pb-8 px-4 text-center">
                  <Info className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Medications Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't added any medications to track. Add your first medication to get started.
                  </p>
                  <Button
                    onClick={() => {
                      setEditingMedication(null);
                      setOpenAddForm(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Medication
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {pendingMedications.length > 0 && (
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Today's Medications</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingMedication(null);
                        setOpenAddForm(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {pendingMedications.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        medication={medication}
                        onMarkTaken={markMedicationTaken}
                        onEdit={handleEdit}
                        onDelete={deleteMedication}
                      />
                    ))}
                  </div>
                </section>
              )}

              {takenMedications.length > 0 && (
                <section className="mt-6">
                  <h2 className="text-lg font-medium mb-4">Completed</h2>
                  <div className="grid gap-4">
                    {takenMedications.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        medication={medication}
                        onMarkTaken={markMedicationTaken}
                        onEdit={handleEdit}
                        onDelete={deleteMedication}
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {pendingMedications.length === 0 && takenMedications.length > 0 && (
                <div className="flex items-center justify-center mt-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg p-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Great job! You've taken all your medications for today.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <AddMedicationForm
          open={openAddForm}
          onOpenChange={setOpenAddForm}
          onSave={handleSaveMedication}
          editingMedication={editingMedication}
        />
      </div>
    </Layout>
  );
};

export default Index;

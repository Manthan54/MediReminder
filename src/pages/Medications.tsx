
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MedicationCard } from '@/components/MedicationCard';
import { AddMedicationForm } from '@/components/AddMedicationForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, SlidersHorizontal, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { useMedications } from '@/context/MedicationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Medications = () => {
  const { 
    medications, 
    markMedicationTaken, 
    updateMedication, 
    deleteMedication,
    addMedication
  } = useMedications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddForm, setOpenAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'time'>('time');

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

  const filteredMedications = medications.filter(medication => 
    medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMedications = [...filteredMedications].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.time.localeCompare(b.time);
    }
  });

  const activeMedications = sortedMedications.filter(med => !med.taken);
  const completedMedications = sortedMedications.filter(med => med.taken);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Medications</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name')} className={sortBy === 'name' ? 'bg-accent text-accent-foreground' : ''}>
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('time')} className={sortBy === 'time' ? 'bg-accent text-accent-foreground' : ''}>
                Sort by Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => {
            setEditingMedication(null);
            setOpenAddForm(true);
          }}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        {medications.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-6 pb-8 px-4 text-center">
              <Info className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Medications Found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't added any medications to your list yet.
              </p>
              <Button
                onClick={() => {
                  setEditingMedication(null);
                  setOpenAddForm(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-4">
              {activeMedications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No matching active medications found' : 'No active medications'}
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeMedications.map((medication) => (
                    <MedicationCard
                      key={medication.id}
                      medication={medication}
                      onMarkTaken={markMedicationTaken}
                      onEdit={handleEdit}
                      onDelete={deleteMedication}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {completedMedications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No matching completed medications found' : 'No completed medications'}
                </div>
              ) : (
                <div className="grid gap-4">
                  {completedMedications.map((medication) => (
                    <MedicationCard
                      key={medication.id}
                      medication={medication}
                      onMarkTaken={markMedicationTaken}
                      onEdit={handleEdit}
                      onDelete={deleteMedication}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        
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

export default Medications;

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, isBefore, isToday, addDays } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarCheck, Clock, User, MapPin, Stethoscope, Calendar as CalendarIcon, X, Edit, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  location: string;
  notes?: string;
}

const specialties = [
  'Primary Care',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'Ophthalmology',
  'Endocrinology',
  'Gastroenterology',
  'Psychiatry',
  'Obstetrics & Gynecology'
];

const timeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

const FormSchema = z.object({
  doctorName: z.string({
    required_error: "Please enter a doctor's name",
  }).min(3, "Doctor name must be at least 3 characters"),
  specialty: z.string({
    required_error: "Please select a specialty",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  location: z.string({
    required_error: "Please enter a location",
  }).min(5, "Location must be at least 5 characters"),
  notes: z.string().optional(),
});

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doctorName: "",
      specialty: "",
      date: undefined,
      time: "",
      location: "",
      notes: "",
    },
  });
  
  const handleSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? null : specialty);
  };
  
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newAppointment: Appointment = {
      id: editingAppointmentId || Date.now().toString(),
      doctorName: data.doctorName,
      specialty: data.specialty,
      date: data.date,
      time: data.time,
      location: data.location,
      notes: data.notes,
    };
    
    if (editingAppointmentId) {
      setAppointments(appointments.map(apt => apt.id === editingAppointmentId ? newAppointment : apt));
      setEditingAppointmentId(null);
      toast.success('Appointment updated successfully');
    } else {
      setAppointments([...appointments, newAppointment]);
      toast.success('Appointment scheduled successfully');
    }
    
    form.reset({
      doctorName: "",
      specialty: "",
      date: undefined,
      time: "",
      location: "",
      notes: "",
    });
  }
  
  const handleEdit = (appointment: Appointment) => {
    form.reset({
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      notes: appointment.notes || '',
    });
    
    setEditingAppointmentId(appointment.id);
  };
  
  const handleCancel = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    
    if (editingAppointmentId === id) {
      setEditingAppointmentId(null);
      form.reset({
        doctorName: "",
        specialty: "",
        date: undefined,
        time: "",
        location: "",
        notes: "",
      });
    }
    
    toast.success('Appointment cancelled');
  };
  
  const isUpcoming = (date: Date) => {
    return isToday(date) || !isBefore(date, new Date());
  };
  
  const upcomingAppointments = appointments.filter(apt => isUpcoming(apt.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
    
  const pastAppointments = appointments.filter(apt => !isUpcoming(apt.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Doctor Appointment Scheduler</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5" />
                  {editingAppointmentId ? 'Edit Appointment' : 'Schedule Appointment'}
                </CardTitle>
                <CardDescription>
                  {editingAppointmentId ? 'Update your existing appointment' : 'Book a new appointment with your doctor'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Filter by Specialty</h3>
                      <div className="flex flex-wrap gap-2">
                        {specialties.map((specialty) => (
                          <Button
                            key={specialty}
                            type="button"
                            variant={selectedSpecialty === specialty ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSpecialtyFilter(specialty)}
                            className="text-xs h-7"
                          >
                            {specialty}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="doctorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter doctor's name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Specialty</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a specialty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specialties.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
                                  {specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter clinic/hospital address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Appointment Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => 
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appointment Time</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Reason for visit, symptoms, questions for the doctor..."
                              className="resize-none"
                            />
                          </FormControl>
                          <FormDescription>
                            Include any important details about your visit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingAppointmentId ? 'Update Appointment' : 'Schedule Appointment'}
                      </Button>
                      {editingAppointmentId && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingAppointmentId(null);
                            form.reset({
                              doctorName: "",
                              specialty: "",
                              date: undefined,
                              time: "",
                              location: "",
                              notes: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  Your scheduled doctor appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <span>{appointment.doctorName}</span>
                              {isToday(appointment.date) && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                  Today
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.specialty}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(appointment)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCancel(appointment.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{format(appointment.date, "MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{appointment.location}</span>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-4 bg-muted/30 p-3 rounded-md">
                            <p className="text-sm">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg">No upcoming appointments</h3>
                    <p className="text-muted-foreground mt-1">Schedule your next appointment with a doctor</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {pastAppointments.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Past Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pastAppointments.slice(0, 3).map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(appointment.date, "MMMM d, yyyy")} at {appointment.time}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Past Appointments
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Bring your ID and insurance card to each appointment</span>
              </li>
              <li className="flex gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Please arrive 15 minutes before your scheduled appointment time</span>
              </li>
              <li className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <span>If you need to cancel, please do so at least 24 hours in advance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Appointments;


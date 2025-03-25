import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  location: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
}

const FormSchema = z.object({
  doctorName: z.string().min(2, {
    message: "Doctor's name must be at least 2 characters.",
  }),
  specialty: z.string({
    required_error: "Please select a specialty.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string().min(5, {
    message: "Time must be in HH:MM format.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  notes: z.string().optional(),
});

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doctorName: '',
      specialty: '',
      date: undefined,
      time: '',
      location: '',
      notes: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: data.doctorName,
      specialty: data.specialty,
      date: data.date,
      time: data.time,
      location: data.location,
      status: 'Upcoming',
      notes: data.notes || '',
    };
    
    setAppointments([...appointments, newAppointment]);
    
    toast.success('Appointment scheduled successfully');
    
    form.reset({
      doctorName: '',
      specialty: '',
      date: undefined,
      time: '',
      location: '',
      notes: '',
    });
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Schedule Appointment
                </CardTitle>
                <CardDescription>
                  Book a new doctor's appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="doctorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. John Doe" {...field} />
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
                          <FormLabel>Specialty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a specialty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cardiology">Cardiology</SelectItem>
                              <SelectItem value="Dermatology">Dermatology</SelectItem>
                              <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                              <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                              <SelectItem value="Neurology">Neurology</SelectItem>
                              <SelectItem value="Oncology">Oncology</SelectItem>
                              <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                              <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                              <SelectItem value="Urology">Urology</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={format(field.value || new Date(), 'PPP') === format(new Date(), 'PPP')
                                      ? "justify-start text-left font-normal text-muted-foreground"
                                      : "justify-start text-left font-normal"}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
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
                          <FormItem className="col-span-1">
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Hospital Name, Clinic Address" {...field} />
                          </FormControl>
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
                              placeholder="Additional information for the appointment"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Schedule Appointment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </div>
                <CardDescription>
                  View and manage your scheduled appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-muted-foreground">No appointments scheduled.</p>
                ) : (
                  <div className="grid gap-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="glass-card">
                        <CardHeader>
                          <CardTitle>{appointment.doctorName}</CardTitle>
                          <CardDescription>{appointment.specialty}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(appointment.date, 'PPP')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span>{appointment.location}</span>
                          </div>
                          {appointment.notes && (
                            <div>
                              <span>Notes: {appointment.notes}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;

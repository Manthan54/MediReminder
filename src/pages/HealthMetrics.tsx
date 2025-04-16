
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PlusCircle, Heart, Activity, Droplets, Scale, Thermometer } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  notes?: string;
  doctorName?: string;
}

const metricTypes = [
  { value: 'Blood Pressure', label: 'Blood Pressure', icon: Heart, unit: 'mmHg' },
  { value: 'Heart Rate', label: 'Heart Rate', icon: Activity, unit: 'bpm' },
  { value: 'Weight', label: 'Weight', icon: Scale, unit: 'lbs' },
  { value: 'Temperature', label: 'Temperature', icon: Thermometer, unit: '°F' },
  { value: 'Blood Glucose', label: 'Blood Glucose', icon: Droplets, unit: 'mg/dL' },
];

const FormSchema = z.object({
  type: z.string({
    required_error: "Please select a metric type",
  }),
  value: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Value must be a number",
  }),
  notes: z.string().optional(),
  doctorName: z.string().optional(),
});

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('Blood Pressure');
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: 'Blood Pressure',
      value: '',
      notes: '',
      doctorName: '',
    },
  });
  
  const filteredMetrics = metrics.filter(metric => metric.type === selectedMetricType)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const chartData = filteredMetrics.map(metric => ({
    date: format(metric.date, 'MMM dd'),
    value: metric.value,
  }));
  
  const handleMetricTypeChange = (type: string) => {
    setSelectedMetricType(type);
  };
  
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedType = metricTypes.find(type => type.value === data.type);
    
    if (!selectedType) {
      toast.error("Invalid metric type selected");
      return;
    }
    
    const newMetric: HealthMetric = {
      id: Date.now().toString(),
      type: data.type,
      value: parseFloat(data.value),
      unit: selectedType.unit,
      date: new Date(),
      notes: data.notes,
      doctorName: data.doctorName,
    };
    
    setMetrics(prevMetrics => [...prevMetrics, newMetric]);
    toast.success('Health metric added successfully');
    form.reset({
      type: data.type,
      value: '',
      notes: '',
      doctorName: '',
    });
  }
  
  const getMetricIcon = (type: string) => {
    const metricType = metricTypes.find(t => t.value === type);
    if (!metricType) return Heart;
    return metricType.icon;
  };
  
  const MetricIcon = getMetricIcon(selectedMetricType);
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Health Metrics Tracking</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Add New Measurement
                </CardTitle>
                <CardDescription>
                  Record your latest health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metric Type</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedMetricType(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a metric type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {metricTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <type.icon className="h-4 w-4" />
                                    <span>{type.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The type of health metric you want to record
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type="number"
                                step="0.1"
                                className="rounded-r-none"
                              />
                              <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted">
                                {metricTypes.find(t => t.value === selectedMetricType)?.unit || ''}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="doctorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor Name (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your doctor's name" />
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
                            <Input {...field} placeholder="e.g., After meal, Morning reading" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Save Measurement
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MetricIcon className="h-5 w-5" />
                    {selectedMetricType} History
                  </CardTitle>
                  <div className="flex gap-2">
                    {metricTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={selectedMetricType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMetricTypeChange(type.value)}
                        className="p-2 h-8"
                        title={type.label}
                      >
                        <type.icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
                <CardDescription>
                  Track your {selectedMetricType.toLowerCase()} over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          name={selectedMetricType} 
                          stroke="hsl(var(--primary))" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No data available for {selectedMetricType}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthMetrics;

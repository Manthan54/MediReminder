import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone?: string;
  hours?: string;
}

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'MedPlus Pharmacy',
    address: 'FC Road, Shivajinagar, Pune, Maharashtra 411005',
    distance: 0.8,
    phone: '+91 20 2553 6789',
    hours: 'Open until 10PM'
  },
  {
    id: '2',
    name: 'Apollo Pharmacy',
    address: 'Aundh Road, Pune, Maharashtra 411007',
    distance: 1.2,
    phone: '+91 20 2588 4567',
    hours: 'Open until 11PM'
  },
  {
    id: '3',
    name: 'Wellness Forever',
    address: 'Koregaon Park, Pune, Maharashtra 411001',
    distance: 2.5,
    phone: '+91 20 2615 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '4',
    name: 'Noble Pharmacy',
    address: 'Viman Nagar, Pune, Maharashtra 411014',
    distance: 3.1,
    phone: '+91 20 2668 9012',
    hours: 'Open 24 hours'
  },
  {
    id: '5',
    name: 'Medlife Pharmacy',
    address: 'Baner Road, Pune, Maharashtra 411045',
    distance: 3.7,
    phone: '+91 20 2567 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '6',
    name: 'LifeCare Pharmacy',
    address: 'Hadapsar, Pune, Maharashtra 411028',
    distance: 4.2,
    phone: '+91 20 2689 7654',
    hours: 'Open until 10PM'
  },
  {
    id: '7',
    name: 'Sahyadri Medical Store',
    address: 'Sinhagad Road, Pune, Maharashtra 411041',
    distance: 4.6,
    phone: '+91 20 2565 4321',
    hours: 'Open until 9:30PM'
  },
  {
    id: '8',
    name: 'MK Pharmacy',
    address: 'Kothrud, Pune, Maharashtra 411038',
    distance: 5.0,
    phone: '+91 20 2546 8765',
    hours: 'Open until 10PM'
  },
  {
    id: '9',
    name: 'Poona Pharmacy',
    address: 'Camp Area, Pune, Maharashtra 411001',
    distance: 1.5,
    phone: '+91 20 2612 3456',
    hours: 'Open until 8:30PM'
  },
  {
    id: '10',
    name: 'Wellness Plus Pharmacy',
    address: 'NIBM Road, Pune, Maharashtra 411048',
    distance: 6.2,
    phone: '+91 20 2689 0123',
    hours: 'Open until 9PM'
  },
  {
    id: '11',
    name: 'Pulse Pharmacy',
    address: 'Kalyani Nagar, Pune, Maharashtra 411006',
    distance: 3.8,
    phone: '+91 20 2665 7890',
    hours: 'Open until 11PM'
  },
  {
    id: '12',
    name: 'Deccan Chemist',
    address: 'Deccan Gymkhana, Pune, Maharashtra 411004',
    distance: 1.9,
    phone: '+91 20 2567 8901',
    hours: 'Open until 10:30PM'
  },
  {
    id: '13',
    name: 'Care Pharmacy',
    address: 'Wakad, Pune, Maharashtra 411057',
    distance: 8.5,
    phone: '+91 20 2703 4567',
    hours: 'Open until 9PM'
  },
  {
    id: '14',
    name: 'Medicore Pharmacy',
    address: 'Hinjewadi, Pune, Maharashtra 411057',
    distance: 9.7,
    phone: '+91 20 2712 6789',
    hours: 'Open 24 hours'
  },
  {
    id: '15',
    name: 'Sanjeevani Medical',
    address: 'Kharadi, Pune, Maharashtra 411014',
    distance: 7.3,
    phone: '+91 20 2678 9012',
    hours: 'Open until 10PM'
  },
  {
    id: '16',
    name: 'Arogya Pharmacy',
    address: 'Aundh, Pune, Maharashtra 411007',
    distance: 5.8,
    phone: '+91 20 2580 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '17',
    name: 'Green Cross Pharmacy',
    address: 'Model Colony, Pune, Maharashtra 411016',
    distance: 2.7,
    phone: '+91 20 2566 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '18',
    name: 'Wellness Zone',
    address: 'Kondhwa, Pune, Maharashtra 411048',
    distance: 7.9,
    phone: '+91 20 2682 3456',
    hours: 'Open until 8:30PM'
  },
  {
    id: '19',
    name: 'Dhanwantari Medical',
    address: 'Warje, Pune, Maharashtra 411058',
    distance: 6.4,
    phone: '+91 20 2520 9012',
    hours: 'Open until 10PM'
  },
  {
    id: '20',
    name: 'Wellness Hub Pharmacy',
    address: 'Pimpri-Chinchwad, Pune, Maharashtra 411018',
    distance: 11.2,
    phone: '+91 20 2742 5678',
    hours: 'Open 24 hours'
  },
];

const PharmacyLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPharmacies(mockPharmacies);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setPharmacies(mockPharmacies);
      return;
    }
    
    const filteredPharmacies = mockPharmacies.filter(
      pharmacy => 
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setPharmacies(filteredPharmacies);
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          setIsLoading(false);
          toast.success('Location found successfully');
          
          setPharmacies(mockPharmacies.sort((a, b) => a.distance - b.distance));
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          toast.error('Failed to get your location. Please check your browser settings.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Pharmacy Locator</h1>
        
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle>Find a Pharmacy in Pune</CardTitle>
            <CardDescription>
              Locate nearby pharmacies to fill your prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search by name or address..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSearch} className="md:w-auto w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={getCurrentLocation} 
                disabled={isLoading}
                className="md:w-auto w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {isLoading ? "Locating..." : "Use My Location"}
              </Button>
            </div>
            
            <div className="space-y-4">
              {pharmacies.length > 0 ? (
                pharmacies.map((pharmacy) => (
                  <Card key={pharmacy.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{pharmacy.address}</p>
                          {pharmacy.phone && (
                            <p className="text-sm mt-1">{pharmacy.phone}</p>
                          )}
                          {pharmacy.hours && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{pharmacy.hours}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            {pharmacy.distance} km away
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => openDirections(pharmacy.address)}
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No pharmacies found. Try a different search term or location.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PharmacyLocator;


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
  {
    id: '21',
    name: 'Pune Medical Store',
    address: 'Parvati, Pune, Maharashtra 411009',
    distance: 4.1,
    phone: '+91 20 2422 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '22',
    name: 'Aarogya Pharmacy Plus',
    address: 'Wanowrie, Pune, Maharashtra 411040',
    distance: 6.8,
    phone: '+91 20 2687 8901',
    hours: 'Open until 10PM'
  },
  {
    id: '23',
    name: 'Wellness Pharma',
    address: 'Mundhwa, Pune, Maharashtra 411036',
    distance: 5.9,
    phone: '+91 20 2686 4567',
    hours: 'Open until 9:30PM'
  },
  {
    id: '24',
    name: 'Health First Pharmacy',
    address: 'Vishrantwadi, Pune, Maharashtra 411015',
    distance: 7.2,
    phone: '+91 20 2713 0123',
    hours: 'Open until 10PM'
  },
  {
    id: '25',
    name: 'City Care Pharmacy',
    address: 'Bhosari, Pune, Maharashtra 411026',
    distance: 12.5,
    phone: '+91 20 2711 5678',
    hours: 'Open until 9PM'
  },
  {
    id: '26',
    name: 'Lifeline Medical',
    address: 'Katraj, Pune, Maharashtra 411046',
    distance: 8.6,
    phone: '+91 20 2425 9012',
    hours: 'Open until 9:30PM'
  },
  {
    id: '27',
    name: 'Medicare Pharmacy',
    address: 'Yerwada, Pune, Maharashtra 411006',
    distance: 4.2,
    phone: '+91 20 2614 3456',
    hours: 'Open until 10PM'
  },
  {
    id: '28',
    name: 'Global Pharmacy',
    address: 'Magarpatta City, Pune, Maharashtra 411013',
    distance: 6.3,
    phone: '+91 20 2689 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '29',
    name: 'HealthPlus Chemist',
    address: 'Bavdhan, Pune, Maharashtra 411021',
    distance: 7.6,
    phone: '+91 20 2522 2345',
    hours: 'Open until 9:30PM'
  },
  {
    id: '30',
    name: 'MediCentral',
    address: 'Pashan, Pune, Maharashtra 411008',
    distance: 6.1,
    phone: '+91 20 2558 6789',
    hours: 'Open until 10PM'
  },
  {
    id: '31',
    name: 'Ayush Medical Store',
    address: 'Lohegaon, Pune, Maharashtra 411032',
    distance: 8.9,
    phone: '+91 20 2692 1234',
    hours: 'Open until 9PM'
  },
  {
    id: '32',
    name: 'Sunrise Pharmacy',
    address: 'Karve Nagar, Pune, Maharashtra 411052',
    distance: 5.6,
    phone: '+91 20 2546 5678',
    hours: 'Open until 10:30PM'
  },
  {
    id: '33',
    name: 'Healthwise Chemist',
    address: 'Akurdi, Pune, Maharashtra 411035',
    distance: 14.2,
    phone: '+91 20 2747 9012',
    hours: 'Open until 9PM'
  },
  {
    id: '34',
    name: 'UniCare Pharmacy',
    address: 'Bund Garden Road, Pune, Maharashtra 411001',
    distance: 2.2,
    phone: '+91 20 2613 3456',
    hours: 'Open until 10PM'
  },
  {
    id: '35',
    name: 'Sai Medical',
    address: 'Undri, Pune, Maharashtra 411060',
    distance: 9.8,
    phone: '+91 20 2689 7890',
    hours: 'Open until 9:30PM'
  },
  {
    id: '36',
    name: 'Family Pharmacy',
    address: 'Kondhwa Budruk, Pune, Maharashtra 411048',
    distance: 8.3,
    phone: '+91 20 2683 1234',
    hours: 'Open until 9PM'
  },
  {
    id: '37',
    name: 'Wellness World',
    address: 'Wagholi, Pune, Maharashtra 412207',
    distance: 15.6,
    phone: '+91 20 2702 5678',
    hours: 'Open until 9:30PM'
  },
  {
    id: '38',
    name: 'Lifesaver Chemist',
    address: 'Pimple Saudagar, Pune, Maharashtra 411027',
    distance: 10.8,
    phone: '+91 20 2740 9012',
    hours: 'Open until 10PM'
  },
  {
    id: '39',
    name: 'FamilyCare Pharmacy',
    address: 'Bibwewadi, Pune, Maharashtra 411037',
    distance: 5.7,
    phone: '+91 20 2424 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '40',
    name: 'Modern Medical Store',
    address: 'Dhankawadi, Pune, Maharashtra 411043',
    distance: 7.4,
    phone: '+91 20 2426 7890',
    hours: 'Open until 10PM'
  },
  {
    id: '41',
    name: 'Wellness Shop',
    address: 'Wadgaon Sheri, Pune, Maharashtra 411014',
    distance: 6.9,
    phone: '+91 20 2687 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '42',
    name: 'Health Harbor',
    address: 'Erandwane, Pune, Maharashtra 411004',
    distance: 3.2,
    phone: '+91 20 2546 5678',
    hours: 'Open until 10PM'
  },
  {
    id: '43',
    name: 'Medi Mart Pharmacy',
    address: 'Swargate, Pune, Maharashtra 411042',
    distance: 3.6,
    phone: '+91 20 2421 9012',
    hours: 'Open until 9PM'
  },
  {
    id: '44',
    name: 'Shanti Medical',
    address: 'Market Yard, Pune, Maharashtra 411037',
    distance: 4.9,
    phone: '+91 20 2427 3456',
    hours: 'Open until 10:30PM'
  },
  {
    id: '45',
    name: 'HealthCore Pharmacy',
    address: 'Pimpri, Pune, Maharashtra 411017',
    distance: 11.8,
    phone: '+91 20 2742 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '46',
    name: 'Pharma Care Plus',
    address: 'Shukrawar Peth, Pune, Maharashtra 411002',
    distance: 2.8,
    phone: '+91 20 2447 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '47',
    name: 'Quick Meds',
    address: 'Raviwar Peth, Pune, Maharashtra 411002',
    distance: 2.6,
    phone: '+91 20 2445 5678',
    hours: 'Open until 10PM'
  },
  {
    id: '48',
    name: 'New Life Pharmacy',
    address: 'Budhwar Peth, Pune, Maharashtra 411002',
    distance: 2.5,
    phone: '+91 20 2446 9012',
    hours: 'Open until 9PM'
  },
  {
    id: '49',
    name: 'Total Health Pharmacy',
    address: 'Somwar Peth, Pune, Maharashtra 411011',
    distance: 2.4,
    phone: '+91 20 2448 3456',
    hours: 'Open until 10PM'
  },
  {
    id: '50',
    name: 'Care Plus Pharmacy',
    address: 'Narayan Peth, Pune, Maharashtra 411030',
    distance: 2.3,
    phone: '+91 20 2449 7890',
    hours: 'Open until 9:30PM'
  },
  {
    id: '51',
    name: 'Ashok Medical',
    address: 'Nana Peth, Pune, Maharashtra 411002',
    distance: 2.7,
    phone: '+91 20 2441 1234',
    hours: 'Open until 9PM'
  },
  {
    id: '52',
    name: 'Shree Pharmacy',
    address: 'Mangalwar Peth, Pune, Maharashtra 411011',
    distance: 2.9,
    phone: '+91 20 2442 5678',
    hours: 'Open until 10PM'
  },
  {
    id: '53',
    name: 'Reliable Chemist',
    address: 'Ghorpade Peth, Pune, Maharashtra 411042',
    distance: 3.3,
    phone: '+91 20 2443 9012',
    hours: 'Open until 9:30PM'
  },
  {
    id: '54',
    name: 'City Medical Center',
    address: 'Ganj Peth, Pune, Maharashtra 411042',
    distance: 3.1,
    phone: '+91 20 2444 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '55',
    name: 'Pune Pharmacy',
    address: 'Sadashiv Peth, Pune, Maharashtra 411030',
    distance: 2.4,
    phone: '+91 20 2447 7890',
    hours: 'Open until 10PM'
  },
  {
    id: '56',
    name: 'Prime Care Medical',
    address: 'Rasta Peth, Pune, Maharashtra 411011',
    distance: 2.6,
    phone: '+91 20 2448 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '57',
    name: 'Navaratna Pharmacy',
    address: 'Guruwar Peth, Pune, Maharashtra 411042',
    distance: 2.8,
    phone: '+91 20 2443 5678',
    hours: 'Open until 9PM'
  },
  {
    id: '58',
    name: 'Prime Health Pharmacy',
    address: 'Bhavani Peth, Pune, Maharashtra 411042',
    distance: 3.2,
    phone: '+91 20 2441 9012',
    hours: 'Open until 10PM'
  },
  {
    id: '59',
    name: 'Mahatma Pharmacy',
    address: 'Kasba Peth, Pune, Maharashtra 411011',
    distance: 3.0,
    phone: '+91 20 2445 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '60',
    name: 'Good Health Chemist',
    address: 'Ganesh Peth, Pune, Maharashtra 411002',
    distance: 2.7,
    phone: '+91 20 2446 7890',
    hours: 'Open until 9:30PM'
  },
  {
    id: '61',
    name: 'Om Medical Store',
    address: 'Khadki, Pune, Maharashtra 411020',
    distance: 7.5,
    phone: '+91 20 2573 1234',
    hours: 'Open until 9PM'
  },
  {
    id: '62',
    name: 'Shivam Pharmacy',
    address: 'Dapodi, Pune, Maharashtra 411012',
    distance: 10.3,
    phone: '+91 20 2743 5678',
    hours: 'Open until 10PM'
  },
  {
    id: '63',
    name: 'Swami Pharmacy',
    address: 'Chinchwad, Pune, Maharashtra 411019',
    distance: 13.2,
    phone: '+91 20 2745 9012',
    hours: 'Open until 9:30PM'
  },
  {
    id: '64',
    name: 'Samarth Medical',
    address: 'Nigdi, Pune, Maharashtra 411044',
    distance: 15.6,
    phone: '+91 20 2746 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '65',
    name: 'Trustworthy Pharmacy',
    address: 'Chikhali, Pune, Maharashtra 411062',
    distance: 16.8,
    phone: '+91 20 2715 7890',
    hours: 'Open until 10PM'
  },
  {
    id: '66',
    name: 'MediSurg Pharmacy',
    address: 'Moshi, Pune, Maharashtra 412105',
    distance: 18.2,
    phone: '+91 20 2716 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '67',
    name: 'Health Way Pharmacy',
    address: 'Dighi, Pune, Maharashtra 411015',
    distance: 9.5,
    phone: '+91 20 2717 5678',
    hours: 'Open until 9PM'
  },
  {
    id: '68',
    name: 'CarePlus Chemist',
    address: 'Pimple Gurav, Pune, Maharashtra 411061',
    distance: 11.4,
    phone: '+91 20 2741 9012',
    hours: 'Open until 10PM'
  },
  {
    id: '69',
    name: 'Star Medical',
    address: 'Sangvi, Pune, Maharashtra 411027',
    distance: 8.9,
    phone: '+91 20 2746 3456',
    hours: 'Open until 9:30PM'
  },
  {
    id: '70',
    name: 'Sai Medical Center',
    address: 'Wakdewadi, Pune, Maharashtra 411003',
    distance: 4.3,
    phone: '+91 20 2553 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '71',
    name: 'Navjeevan Pharmacy',
    address: 'Junnar, Pune, Maharashtra 410502',
    distance: 92.6,
    phone: '+91 2132 222345',
    hours: 'Open until 9PM'
  },
  {
    id: '72',
    name: 'Bhairav Medical',
    address: 'Ambegaon, Pune, Maharashtra 411046',
    distance: 12.5,
    phone: '+91 20 2428 5678',
    hours: 'Open until 10PM'
  },
  {
    id: '73',
    name: 'Ganesh Pharmacy',
    address: 'Talegaon Dabhade, Pune, Maharashtra 410506',
    distance: 35.8,
    phone: '+91 2114 222901',
    hours: 'Open until 9:30PM'
  },
  {
    id: '74',
    name: 'Sathe Chemist',
    address: 'Chakan, Pune, Maharashtra 410501',
    distance: 32.6,
    phone: '+91 2135 249012',
    hours: 'Open until 9PM'
  },
  {
    id: '75',
    name: 'Suyash Medical Store',
    address: 'Alandi, Pune, Maharashtra 412105',
    distance: 21.3,
    phone: '+91 20 2703 3456',
    hours: 'Open until 10PM'
  },
  {
    id: '76',
    name: 'Sharada Pharmacy',
    address: 'Daund, Pune, Maharashtra 413801',
    distance: 76.2,
    phone: '+91 2117 262789',
    hours: 'Open until 9:30PM'
  },
  {
    id: '77',
    name: 'Universal Medical',
    address: 'Baramati, Pune, Maharashtra 413102',
    distance: 95.7,
    phone: '+91 2112 224123',
    hours: 'Open until 9PM'
  },
  {
    id: '78',
    name: 'Narayani Pharmacy',
    address: 'Indapur, Pune, Maharashtra 413106',
    distance: 125.8,
    phone: '+91 2111 223567',
    hours: 'Open until 10PM'
  },
  {
    id: '79',
    name: 'Krishna Medical Store',
    address: 'Bhor, Pune, Maharashtra 412206',
    distance: 45.6,
    phone: '+91 2113 222901',
    hours: 'Open until 9:30PM'
  },
  {
    id: '80',
    name: 'Shivneri Pharmacy',
    address: 'Shirur, Pune, Maharashtra 412210',
    distance: 62.3,
    phone: '+91 2138 222345',
    hours: 'Open until 9PM'
  },
  {
    id: '81',
    name: 'Parvati Medical',
    address: 'Velha, Pune, Maharashtra 412214',
    distance: 58.9,
    phone: '+91 2130 253456',
    hours: 'Open until 8:30PM'
  },
  {
    id: '82',
    name: 'Sahyadri Health Care',
    address: 'Saswad, Pune, Maharashtra 412301',
    distance: 30.2,
    phone: '+91 20 2636 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '83',
    name: 'Krushna Pharmacy',
    address: 'Purandar, Pune, Maharashtra 412301',
    distance: 40.8,
    phone: '+91 20 2635 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '84',
    name: 'Mahalaxmi Medical Store',
    address: 'Mulshi, Pune, Maharashtra 412115',
    distance: 25.6,
    phone: '+91 20 2559 5678',
    hours: 'Open until 9PM'
  },
  {
    id: '85',
    name: 'Dhanvantari Pharmacy',
    address: 'Maval, Pune, Maharashtra 410506',
    distance: 45.3,
    phone: '+91 2114 262901',
    hours: 'Open until 10PM'
  },
  {
    id: '86',
    name: 'Ramdas Medical',
    address: 'Khed, Pune, Maharashtra 410501',
    distance: 38.7,
    phone: '+91 2135 252345',
    hours: 'Open until 9:30PM'
  },
  {
    id: '87',
    name: 'Bhagwati Pharmacy',
    address: 'Ambegaon BK, Pune, Maharashtra 411046',
    distance: 14.5,
    phone: '+91 20 2428 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '88',
    name: 'Gajanan Medical',
    address: 'Dhayari, Pune, Maharashtra 411041',
    distance: 10.8,
    phone: '+91 20 2427 7890',
    hours: 'Open until 10PM'
  },
  {
    id: '89',
    name: 'Mauli Pharmacy',
    address: 'Sus, Pune, Maharashtra 411021',
    distance: 9.6,
    phone: '+91 20 2565 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '90',
    name: 'Siddhivinayak Medical',
    address: 'Lavale, Pune, Maharashtra 412115',
    distance: 15.3,
    phone: '+91 20 2563 5678',
    hours: 'Open until 9PM'
  },
  {
    id: '91',
    name: 'Vijay Medical Store',
    address: 'Pirangut, Pune, Maharashtra 412115',
    distance: 18.7,
    phone: '+91 20 2564 9012',
    hours: 'Open until 10PM'
  },
  {
    id: '92',
    name: 'Nirmala Pharmacy',
    address: 'Manjri, Pune, Maharashtra 412307',
    distance: 11.4,
    phone: '+91 20 2687 3456',
    hours: 'Open until 9:30PM'
  },
  {
    id: '93',
    name: 'Sunshine Pharmacy',
    address: 'Fursungi, Pune, Maharashtra 412308',
    distance: 13.8,
    phone: '+91 20 2699 7890',
    hours: 'Open until 9PM'
  },
  {
    id: '94',
    name: 'Siddhi Medical',
    address: 'Loni Kalbhor, Pune, Maharashtra 412201',
    distance: 18.2,
    phone: '+91 20 2697 1234',
    hours: 'Open until 9:30PM'
  },
  {
    id: '95',
    name: 'Shree Sai Pharmacy',
    address: 'Uruli Kanchan, Pune, Maharashtra 412202',
    distance: 25.6,
    phone: '+91 20 2691 5678',
    hours: 'Open until 9PM'
  },
  {
    id: '96',
    name: 'Mahadev Medical Store',
    address: 'Lonavala, Pune, Maharashtra 410401',
    distance: 65.8,
    phone: '+91 2114 273901',
    hours: 'Open until 10PM'
  },
  {
    id: '97',
    name: 'Vitthal Pharmacy',
    address: 'Kamshet, Pune, Maharashtra 410405',
    distance: 45.2,
    phone: '+91 2114 282345',
    hours: 'Open until 9:30PM'
  },
  {
    id: '98',
    name: 'Satkar Medical',
    address: 'Dehu Road, Pune, Maharashtra 412101',
    distance: 22.6,
    phone: '+91 20 2748 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '99',
    name: 'Renuka Pharmacy',
    address: 'Alandi Road, Pune, Maharashtra 411015',
    distance: 12.3,
    phone: '+91 20 2718 7890',
    hours: 'Open until 10PM'
  },
  {
    id: '100',
    name: 'City Care Medical',
    address: 'Kalyani Nagar, Pune, Maharashtra 411006',
    distance: 3.5,
    phone: '+91 20 2665 5678',
    hours: 'Open until 10:30PM'
  },
  {
    id: '101',
    name: 'MediStar Pharmacy',
    address: 'Sopan Baug, Pune, Maharashtra 411001',
    distance: 2.9,
    phone: '+91 20 2616 7890',
    hours: 'Open until 9:30PM'
  },
  {
    id: '102',
    name: 'LifeLine Plus',
    address: 'Wanwadi, Pune, Maharashtra 411040',
    distance: 5.1,
    phone: '+91 20 2681 1234',
    hours: 'Open until 10PM'
  },
  {
    id: '103',
    name: 'Aishwarya Medical',
    address: 'Salisbury Park, Pune, Maharashtra 411037',
    distance: 4.7,
    phone: '+91 20 2426 3456',
    hours: 'Open until 9PM'
  },
  {
    id: '104',
    name: 'Ajinkya Pharmacy',
    address: 'Wadgaon Budruk, Pune, Maharashtra 411051',
    distance: 9.8,
    phone: '+91 20 2426 5678',
    hours: 'Open until 9:30PM'
  },
  {
    id: '105',
    name: 'Morya Medical Store',
    address: 'Karvenagar, Pune, Maharashtra 411052',
    distance: 6.3,
    phone: '+91 20 2547 9012',
    hours: 'Open until 10PM'
  }
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

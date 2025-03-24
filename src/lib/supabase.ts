
import { createClient } from '@supabase/supabase-js';

// Set the Supabase URL and anon key from the provided values
const supabaseUrl = 'https://ebyzfwrteyxpfrgibkag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVieXpmd3J0ZXl4cGZyZ2lia2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjM4ODUsImV4cCI6MjA1ODIzOTg4NX0.cZUDa5WTe-xN7sgY6lpquqVPM24BxooCnPdbr_EV4qQ';

// Create the Supabase client with the provided credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

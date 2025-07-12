import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kkjvwpmqpqkppyjigzwh.supabase.co'; // TODO: Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtranZ3cG1xcHFrcHB5amlnendoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzM2NzgsImV4cCI6MjA2NzYwOTY3OH0.Z3mmUlaCqzvv34BmQxmLfv4k2jFmeaTUtLEEMxD4tjE'; // TODO: Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 
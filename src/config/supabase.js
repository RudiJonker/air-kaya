import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fooodixnewelmmmtmxcb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb29kaXhuZXdlbG1tbXRteGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU0MzIsImV4cCI6MjA4ODMyMTQzMn0.Y8frhDFLp_4_GSQgmQ1s0ig-gu5-f0uEdEuiFWSlsTw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
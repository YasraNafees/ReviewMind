import { createClient } from '@supabase/supabase-js';
import { logInfo, logError } from '../utils/logger';

const FILE = 'supabase.js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (SUPABASE_URL && !SUPABASE_URL.includes('YOUR')) {
  logInfo(FILE, 'init', 'Supabase connected');
} else {
  logError(FILE, 'init', 'Credentials missing in .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY,{
  auth:{
    storage:window.sessionStorage,
    autoRefreshToken:false,
  }
});
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vryowhalvkvfkvatrpoc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyeW93aGFsdmt2Zmt2YXRycG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjU2NjAsImV4cCI6MjA2MzcwMTY2MH0.XVIoDTnV-9SQm26lOHFW3lUHXdg-NOckfZ_K2FqFTXE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
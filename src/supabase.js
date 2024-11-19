import { createClient } from "@supabase/supabase-js";

const supabase_url = 'https://zkiomaxriaexlcqljavb.supabase.co';

const supabase_anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraW9tYXhyaWFleGxjcWxqYXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NjIzNDksImV4cCI6MjA0NjMzODM0OX0.13ilDDMF1O7u8lkXO4gvk7S8xVblf6LXGb5yAUrK2Mg';

export const supabase = createClient(supabase_url, supabase_anon);
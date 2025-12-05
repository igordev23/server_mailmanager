import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();


const supabaseUrl = 'https://eyxrecmdbhonaiyklcqz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseKey // precisa ser a service_role
);

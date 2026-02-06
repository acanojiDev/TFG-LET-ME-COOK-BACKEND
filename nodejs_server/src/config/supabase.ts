// src/config/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Debug logging
console.log("Supabase Config Loading:");
console.log("URL:", supabaseUrl ? "Found" : "Missing");
console.log("Key:", supabaseKey ? "Found" : "Missing");

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is missing in .env.");
  console.warn("⚠️ Authentication features (Register/Login) will fail.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", // Prevent crash on load
  supabaseKey || "placeholder-key"
);

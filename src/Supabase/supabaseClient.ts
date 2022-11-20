import { definitions, paths } from './../Interface/generated-types';
// @ts-ignore
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@env';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from "../../DatabaseDefinitions";

const supabaseUrl = SUPABASE_URL
const supabaseAnonKey = SUPABASE_PUBLIC_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
import { PostgrestClient } from '@supabase/postgrest-js';

const REST_URL = 'http://localhost:8080/rest';
export const rest = new PostgrestClient(REST_URL);

import {
  createClient
} from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://juoaaurvncymcnafvjwv.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_qrbFv8kne4neID6HiybkGA_UdOvwV_4";

export const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
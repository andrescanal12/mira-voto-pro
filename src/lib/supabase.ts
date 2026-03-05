import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cfmtmncadfuolsgnylls.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXRtbmNhZGZ1b2xzZ255bGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODkzOTEsImV4cCI6MjA4ODI2NTM5MX0.QAqcQGohWenGR1JsJiURf5qNaJkvgRqfYiRxllin7Z8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

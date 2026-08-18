import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-key")

def test_supabase_client():
    print(f"Connecting to Supabase REST API at {SUPABASE_URL}...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        res = supabase.table("appointments").select("*").execute()
        print("SUCCESS: Supabase API Connected! Found appointments data:")
        print(res.data)
        return True
    except Exception as e:
        print(f"INFO: Supabase table query result/status: {str(e)}")
        return False

if __name__ == "__main__":
    test_supabase_client()

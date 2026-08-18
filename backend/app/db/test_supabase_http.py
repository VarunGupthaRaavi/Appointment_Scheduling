import httpx
from supabase import create_client, Client

SUPABASE_URL = "https://isfmahsyycgokjxtkppr.supabase.co"
SUPABASE_KEY = "sb_publishable_1ftKFBtNRmxIbtwF9AQ4bA_RDeMN9vP"

def test_supabase_client():
    print(f"Connecting to Supabase REST API at {SUPABASE_URL}...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        # Query public schema tables
        res = supabase.table("appointments").select("*").execute()
        print("SUCCESS: Supabase API Connected! Found appointments data:")
        print(res.data)
        return True
    except Exception as e:
        print(f"INFO: Supabase table query result/status: {str(e)}")
        return False

if __name__ == "__main__":
    test_supabase_client()

import socket
import psycopg2

hosts_to_test = [
    ("db.isfmahsyycgokjxtkppr.supabase.co", 5432),
    ("aws-0-us-east-1.pooler.supabase.com", 6543),
    ("aws-0-us-east-1.pooler.supabase.com", 5432),
    ("aws-0-ap-southeast-1.pooler.supabase.com", 6543),
    ("aws-0-eu-central-1.pooler.supabase.com", 6543),
    ("aws-0-us-west-1.pooler.supabase.com", 6543),
    ("aws-0-sa-east-1.pooler.supabase.com", 6543),
    ("aws-0-ap-south-1.pooler.supabase.com", 6543)
]

def test_dns():
    print("Testing Supabase PostgreSQL Host Resolution...")
    for host, port in hosts_to_test:
        try:
            ip = socket.gethostbyname(host)
            print(f"SUCCESS: Host resolved: {host} -> {ip}:{port}")
            try:
                conn_str = f"postgresql://postgres.isfmahsyycgokjxtkppr:Appointmnet143@{host}:{port}/postgres"
                conn = psycopg2.connect(conn_str, connect_timeout=5)
                print(f"SUCCESS: Connected to Postgres at {host}:{port}")
                conn.close()
                return conn_str
            except Exception as ce:
                print(f"   (Postgres connection attempt note: {str(ce)})")
        except Exception as e:
            print(f"Could not resolve host {host}: {str(e)}")

if __name__ == "__main__":
    test_dns()

import psycopg2

project_id = "isfmahsyycgokjxtkppr"
password = "Appointmnet143"

regions = [
    "aws-0-us-east-1",
    "aws-0-us-west-1",
    "aws-0-ap-south-1",
    "aws-0-ap-southeast-1",
    "aws-0-ap-northeast-1",
    "aws-0-eu-central-1",
    "aws-0-eu-west-1",
    "aws-0-sa-east-1"
]

def test():
    print("Testing connection string across Supabase AWS regions...")
    for reg in regions:
        host = f"{reg}.pooler.supabase.com"
        for user in [f"postgres.{project_id}", "postgres"]:
            for port in [5432, 6543]:
                try:
                    conn_str = f"postgresql://{user}:{password}@{host}:{port}/postgres"
                    conn = psycopg2.connect(conn_str, connect_timeout=3)
                    print(f"SUCCESS: Connected to Postgres with {user} at {host}:{port}!")
                    conn.close()
                    return conn_str
                except Exception as e:
                    err = str(e).strip()
                    if "tenant/user" not in err and "getaddrinfo" not in err:
                        print(f"Note for {user}@{host}:{port} -> {err}")

if __name__ == "__main__":
    test()

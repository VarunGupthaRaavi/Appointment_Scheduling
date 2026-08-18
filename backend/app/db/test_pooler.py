import os
import socket
import psycopg2

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/postgres")

def test_dns():
    print("Testing PostgreSQL Host Resolution...")
    try:
        conn = psycopg2.connect(DATABASE_URL, connect_timeout=5)
        print("SUCCESS: Connected to Postgres database!")
        conn.close()
        return True
    except Exception as e:
        print(f"Could not connect to database: {str(e)}")
        return False

if __name__ == "__main__":
    test_dns()

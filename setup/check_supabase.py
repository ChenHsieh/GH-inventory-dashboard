import streamlit as st
from supabase import create_client, Client

def check_supabase_tables():
    """Check what tables exist in Supabase"""
    
    # Initialize Supabase client
    try:
        SUPABASE_URL = st.secrets["supabase"]["url"]
        SUPABASE_KEY = st.secrets["supabase"]["key"]
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except:
        # Fallback for running outside Streamlit - load from environment or prompt user
        import os
        SUPABASE_URL = os.getenv('SUPABASE_URL')
        SUPABASE_KEY = os.getenv('SUPABASE_KEY')
        
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("❌ Supabase credentials not found!")
            print("Please set environment variables:")
            print("  export SUPABASE_URL='your-supabase-url'")
            print("  export SUPABASE_KEY='your-anon-key'")
            print("Or run this script from within the Streamlit app context")
            return
            
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔍 Checking Supabase connection and tables...")
    
    try:
        # Try to query the information schema to list tables
        response = supabase.rpc('get_tables').execute()
        if response.data:
            print("📋 Available tables:")
            for table in response.data:
                print(f"  - {table}")
        else:
            print("ℹ️  No custom tables found or unable to list tables")
            
    except Exception as e:
        print(f"⚠️  Could not list tables: {e}")
        print("🔧 This might be because the RPC function doesn't exist")
    
    # Try some common table names that might exist
    common_tables = ["plant_inventory", "plants", "inventory", "plant_data"]
    
    print("\n🔍 Testing common table names...")
    for table_name in common_tables:
        try:
            # Try different query approaches
            print(f"\n🔍 Testing table '{table_name}'...")
            
            # Method 1: Simple select with limit
            response = supabase.table(table_name).select("*").limit(1).execute()
            
            # Handle different response types
            if hasattr(response, 'data') and response.data is not None:
                if response.data and len(response.data) > 0:
                    print(f"✅ Table '{table_name}' exists and has data")
                    print(f"   Sample columns: {list(response.data[0].keys())}")
                    print(f"   Sample data: {response.data[0]}")
                else:
                    print(f"⚠️  Table '{table_name}' exists but appears empty via API")
                    
                    # Try to get count
                    try:
                        count_response = supabase.table(table_name).select("*", count="exact").execute()
                        if hasattr(count_response, 'count'):
                            print(f"   Actual count: {count_response.count}")
                        else:
                            print(f"   Could not get count")
                    except Exception as count_error:
                        print(f"   Count error: {count_error}")
                        
                    # Check if it's an RLS issue
                    print(f"   This might be due to Row Level Security (RLS) policies")
                    
            elif hasattr(response, 'error') and response.error:
                print(f"❌ Table '{table_name}': {response.error}")
            else:
                print(f"❌ Table '{table_name}': Unknown response format: {type(response)}")
                print(f"   Response: {response}")
                
        except Exception as e:
            print(f"❌ Table '{table_name}': {e}")

if __name__ == "__main__":
    check_supabase_tables()

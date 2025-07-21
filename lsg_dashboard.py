import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
from datetime import datetime, timedelta
import warnings
from supabase import create_client, Client

warnings.filterwarnings('ignore')

# Page configuration
st.set_page_config(
    page_title="LSG Project Plant Inventory Dashboard",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main > div {
        padding-top: 2rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        border: 1px solid #e0e0e0;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .recommendation-card {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 5px;
    }
    .critical-card {
        background-color: #f8d7da;
        border-left: 4px solid #dc3545;
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 5px;
    }
    .success-card {
        background-color: #d1ecf1;
        border-left: 4px solid #17a2b8;
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 5px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Supabase client
SUPABASE_URL = st.secrets["supabase"]["url"]
SUPABASE_KEY = st.secrets["supabase"]["key"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@st.cache_data
def load_data():
    """Load and process the plant inventory data from Supabase or fallback to CSV"""
    data_source = "Unknown"
    
    try:
        # Try to fetch data from Supabase first
        response = supabase.table("plant_inventory").select("*").execute()
        
        # Check if response has data (successful)
        if hasattr(response, 'data') and response.data is not None:
            # Convert to DataFrame
            df = pd.DataFrame(response.data)
            data_source = "Supabase"
            st.success("✅ Data loaded from Supabase database")
        else:
            raise Exception("No data returned from Supabase")
        
    except Exception as e:
        st.warning(f"⚠️ Supabase connection failed: {e}. Falling back to local CSV.")
        try:
            # Fallback to local CSV
            df = pd.read_csv("GH inventory - Plant inventory.csv")
            data_source = "Local CSV"
            st.info("📁 Data loaded from local CSV file")
        except Exception as csv_error:
            st.error(f"❌ Failed to load data from both Supabase and CSV: {csv_error}")
            return pd.DataFrame(), "None"
    
    # Filter for LSG group only
    lsg_df = df[df['Group'] == 'LSG'].copy()
    
    # Clean and process data using the actual column names from your table
    lsg_df['Plant #'] = pd.to_numeric(lsg_df['Plant #'], errors='coerce')
    lsg_df['Original date (date of soil transplanting from TC or cutting)'] = pd.to_datetime(
        lsg_df['Original date (date of soil transplanting from TC or cutting)'], 
        errors='coerce'
    )
    lsg_df['Date cutback'] = pd.to_datetime(lsg_df['Date cutback'], errors='coerce')
    lsg_df['Date to killing bench'] = pd.to_datetime(lsg_df['Date to killing bench'], errors='coerce')
    
    return lsg_df, data_source

def get_plant_status(row):
    """Determine plant status based on dates"""
    if pd.notna(row['Date to killing bench']) or pd.notna(row['Termination date & composite site temp']):
        return 'Killed'
    elif pd.notna(row['Date cutback']):
        return 'Cut Back'
    else:
        return 'Active'

def get_days_old(plant_date):
    """Calculate days since planting"""
    if pd.isna(plant_date):
        return 0
    return (datetime.now() - plant_date).days

def needs_attention(row):
    """Determine if plant needs attention"""
    if pd.isna(row['Original date (date of soil transplanting from TC or cutting)']):
        return False
    
    days_old = get_days_old(row['Original date (date of soil transplanting from TC or cutting)'])
    status = get_plant_status(row)
    
    # Plants older than 60 days without cutback might need attention
    if status == 'Active' and days_old > 60:
        return True
    
    # Plants that have been cut back but are still active for too long
    if status == 'Cut Back' and days_old > 90:
        return True
    
    return False

# Modularized functions for metrics and charts

def calculate_summary_metrics(df):
    """Calculate summary metrics for the dashboard."""
    total_plants = len(df)
    unique_genotypes = df['Standardized name (2nd tag by CJ)'].nunique()
    active_plants = len(df[df['Status'] == 'Active'])
    killed_plants = len(df[df['Status'] == 'Killed'])
    return total_plants, unique_genotypes, active_plants, killed_plants

def plot_genotype_distribution(df):
    """Plot the genotype distribution chart."""
    genotype_counts = df['Standardized name (2nd tag by CJ)'].value_counts().head(15)
    if not genotype_counts.empty:
        fig = px.bar(
            x=genotype_counts.values,
            y=genotype_counts.index,
            orientation='h',
            title="Top 15 Genotypes by Plant Count",
            labels={'x': 'Number of Plants', 'y': 'Genotype'},
            color=genotype_counts.values,
            color_continuous_scale='Viridis'
        )
        fig.update_layout(height=400, yaxis={'categoryorder':'total ascending'})
        st.plotly_chart(fig, use_container_width=True)

def plot_status_overview(df):
    """Plot the plant status overview chart."""
    status_counts = df['Status'].value_counts()
    if not status_counts.empty:
        colors = {'Active': '#28a745', 'Cut Back': '#ffc107', 'Killed': '#dc3545'}
        fig = px.pie(
            values=status_counts.values,
            names=status_counts.index,
            title="Distribution of Plant Status",
            color=status_counts.index,
            color_discrete_map=colors
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

def plot_bench_distribution(df):
    """Plot the bench distribution chart."""
    bench_counts = df['Bench #'].value_counts()
    if not bench_counts.empty:
        fig = px.bar(
            x=bench_counts.index,
            y=bench_counts.values,
            title="Plant Distribution Across Benches",
            labels={'x': 'Bench', 'y': 'Number of Plants'},
            color=bench_counts.values,
            color_continuous_scale='Plasma'
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

def plot_planting_timeline(df):
    """Plot the planting timeline chart."""
    timeline_df = df.dropna(subset=['Original date (date of soil transplanting from TC or cutting)'])
    if not timeline_df.empty:
        timeline_df['Month'] = timeline_df['Original date (date of soil transplanting from TC or cutting)'].dt.to_period('M')
        monthly_counts = timeline_df.groupby('Month').size().reset_index(name='Count')
        monthly_counts['Month'] = monthly_counts['Month'].astype(str)
        fig = px.line(
            monthly_counts,
            x='Month',
            y='Count',
            title="Plants by Planting Month",
            markers=True,
            line_shape='spline'
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

def main():
    # Title and header
    st.title("🌱 LSG Project Plant Inventory Dashboard")
    st.markdown("### Comprehensive analysis of plant genotypes and their management status")
    
    # Load data
    df, data_source = load_data()

    # Display data source info
    if data_source == "Supabase":
        st.markdown(f"**📊 Data Source:** 🌐 Supabase Database (Real-time)")
    elif data_source == "Local CSV":
        st.markdown(f"**📊 Data Source:** 📁 Local CSV File")
    else:
        st.markdown(f"**📊 Data Source:** ❓ {data_source}")
    
    st.markdown("---")

    if df.empty:
        st.error("No data available. Please check your data source.")
        return

    # Add computed columns
    df['Status'] = df.apply(get_plant_status, axis=1)
    df['Days Old'] = df['Original date (date of soil transplanting from TC or cutting)'].apply(get_days_old)

    # Sidebar filters
    st.sidebar.header("🔍 Filters")

    # Genotype filter
    genotypes = ['All'] + sorted(df['Standardized name (2nd tag by CJ)'].dropna().unique().tolist())
    selected_genotype = st.sidebar.selectbox("Select Genotype:", genotypes)

    # Status filter
    statuses = ['All'] + sorted(df['Status'].unique().tolist())
    selected_status = st.sidebar.selectbox("Select Status:", statuses)

    # Bench filter
    benches = ['All'] + sorted(df['Bench #'].dropna().unique().tolist())
    selected_bench = st.sidebar.selectbox("Select Bench:", benches)

    # Apply filters
    filtered_df = df.copy()

    if selected_genotype != 'All':
        filtered_df = filtered_df[filtered_df['Standardized name (2nd tag by CJ)'] == selected_genotype]

    if selected_status != 'All':
        filtered_df = filtered_df[filtered_df['Status'] == selected_status]

    if selected_bench != 'All':
        filtered_df = filtered_df[filtered_df['Bench #'] == selected_bench]

    # Summary metrics
    total_plants, unique_genotypes, active_plants, killed_plants = calculate_summary_metrics(filtered_df)

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total LSG Plants", total_plants)

    with col2:
        st.metric("Unique Genotypes", unique_genotypes)

    with col3:
        st.metric("Active Plants", active_plants)

    with col4:
        st.metric("Killed Plants", killed_plants)

    st.markdown("---")

    # Charts section
    if not filtered_df.empty:
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("📊 Genotype Distribution")
            plot_genotype_distribution(filtered_df)

        with col2:
            st.subheader("🎯 Plant Status Overview")
            plot_status_overview(filtered_df)

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("🏢 Plants by Bench Location")
            plot_bench_distribution(filtered_df)

        with col2:
            st.subheader("📅 Planting Timeline")
            plot_planting_timeline(filtered_df)

    else:
        st.warning("No data matches the selected filters. Please adjust your filter criteria.")

    # Display filtered DataFrame at the end of the page
    st.markdown("---")
    st.subheader("📋 Filtered Plant Inventory Data")

    # Prepare display dataframe
    display_df = filtered_df[[
        'Plant #', 'Standardized name (2nd tag by CJ)', 'Bench #',
        'Original date (date of soil transplanting from TC or cutting)',
        'Status', 'Days Old', 'Parent plant (for cuttings)',
        'Other notes'
    ]].copy()

    display_df.columns = [
        'Plant #', 'Genotype', 'Bench', 'Plant Date',
        'Status', 'Days Old', 'Parent Plant', 'Notes'
    ]

    st.dataframe(display_df, use_container_width=True)

if __name__ == "__main__":
    main()

# Plant Inventory Dashboard

A Streamlit dashboard for analyzing plant inventory data

## Features

**Overview Statistics**
- Total plant count, unique genotypes, active plants, and killed plants

**Interactive Visualizations**
- Genotype distribution charts
- Plant status overview (pie chart)
- Bench location analysis
- Planting timeline trends

**Advanced Filtering**
- Filter by genotype, status, bench location
- Real-time dashboard updates based on filters

**Data Sources**
- **Primary**: Supabase database (real-time, cloud-based)
- **Fallback**: Local CSV file (offline backup)

📋 **Detailed Data Table**
- Comprehensive plant inventory with computed status
- Days old calculation and filtering

## Installation

1. **Clone or download this repository**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Setup Options

### Option 1: Supabase Database (Recommended)

1. **Set up your Supabase credentials:**
   - Copy `.streamlit/secrets.toml.template` to `.streamlit/secrets.toml`
   - Fill in your actual Supabase credentials:
   ```toml
   [supabase]
   url = "https://your-project-id.supabase.co"
   key = "your-anon-key"
   ```
   - **⚠️ NEVER commit the actual `secrets.toml` file to version control**

2. **Create the database table:**
   - Go to your Supabase dashboard
   - Run the SQL from `setup/create_table.sql`
   - Set up Row Level Security with `setup/setup_rls_policies.sql`

3. **Upload your data:**
   - Use the Supabase dashboard to upload your CSV
   - Or use the SQL Editor to import data


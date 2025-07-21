# LSG Project Plant Inventory Dashboard

A comprehensive Streamlit dashboard for analyzing plant inventory data from the LSG project, providing insights into genotype performance, plant status, and management recommendations.

## Features

🌱 **Overview Statistics**
- Total plant count, unique genotypes, active plants, and killed plants

📊 **Interactive Visualizations**
- Genotype distribution charts
- Plant status overview (pie chart)
- Bench location analysis
- Planting timeline trends

🔍 **Advanced Filtering**
- Filter by genotype, status, bench location
- Real-time dashboard updates based on filters

� **Data Sources**
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

### Option 2: Local CSV Only

1. **Place your CSV file in the project directory:**
   - File name: `GH inventory - Plant inventory.csv`
   - Ensure it contains LSG group data

## Running the Dashboard

1. **Start the Streamlit app:**
   ```bash
   streamlit run lsg_dashboard.py
   ```

2. **Open your browser:**
   - Dashboard opens automatically at `http://localhost:8501`
   - You'll see the data source indicator at the top

2. **Run the Streamlit app:**
   ```bash
   streamlit run lsg_dashboard.py
   ```

3. **Open your browser**
   - The dashboard will automatically open in your default browser
   - If not, navigate to `http://localhost:8501`

## Dashboard Sections

### 📈 Summary Metrics
- **Total LSG Plants**: Count of all plants in the LSG group
- **Unique Genotypes**: Number of different genotypes being studied
- **Active Plants**: Plants currently growing (not cut back or killed)
- **Killed Plants**: Plants that have been terminated

### 🔍 Filters (Sidebar)
- **Genotype Filter**: Focus on specific plant lines
- **Status Filter**: Show only active, cut back, or killed plants
- **Bench Filter**: Analyze specific greenhouse locations

### 📊 Charts and Analysis
1. **Genotype Distribution**: Top 15 most common genotypes
2. **Plant Status Overview**: Proportion of active, cut back, and killed plants
3. **Bench Analysis**: Plant distribution across greenhouse locations
4. **Timeline**: Planting activity over time

### 📋 Filtered Data View
- Complete plant inventory with computed fields
- Status calculation and days old
- Sortable and searchable table

## Data Requirements

The dashboard expects data with the following columns:
- `Plant #`: Unique plant identifier
- `Original name from researcher`: Original genotype name
- `Standardized name (2nd tag by CJ)`: Standardized genotype name
- `Bench #`: Greenhouse bench location
- `Original date (date of soil transplanting from TC or cutting)`: Planting date
- `Researcher/ownder`: Who planted/owns the plant
- `Group`: Project group (filtered for 'LSG')
- `Date cutback`: When plant was cut back
- `Date to killing bench`: When plant was moved to termination
- `Termination date & composite site temp`: Final termination
- `Construct and target gene info`: Genetic information
- `Other notes`: Additional notes
- `Parent plant (for cuttings)`: Source plant ID

## Plant Status Logic

The dashboard automatically categorizes plants:
- **Active**: No cutback or killing dates recorded
- **Cut Back**: Has cutback date but not killed
- **Killed**: Has termination or killing bench date

## Troubleshooting

### Dashboard Issues
- **Won't start**: Check dependencies with `pip install -r requirements.txt`
- **No data**: Verify data source (Supabase connection or CSV file)
- **Charts not loading**: Clear browser cache, try different browser

### Supabase Issues
- **Connection failed**: Check credentials in `.streamlit/secrets.toml`
- **No data returned**: Verify RLS policies with `setup/setup_rls_policies.sql`
- **Permission denied**: Use service_role key or update policies

### Debug Tools
- Use `python3 setup/check_supabase.py` to test database connection
- Check Supabase dashboard for data and policies

## File Structure

```
GH-inventory-dashboard/
├── lsg_dashboard.py          # Main dashboard application
├── requirements.txt          # Python dependencies
├── GH inventory - Plant inventory.csv  # Local data file (optional)
├── .streamlit/
│   └── secrets.toml         # Supabase credentials (you create this)
└── setup/                   # Setup and debugging scripts
    ├── create_table.sql     # Database table creation
    ├── setup_rls_policies.sql  # Security policies
    ├── disable_rls.sql      # Quick development setup
    └── check_supabase.py    # Connection testing tool
```

## Customization

- **Status logic**: Modify `get_plant_status()` function
- **Chart styling**: Update color schemes in plotting functions
- **Filters**: Add new filter options in the sidebar section
- **Metrics**: Extend `calculate_summary_metrics()` for additional insights

---

*Dashboard created for the LSG project plant inventory management*

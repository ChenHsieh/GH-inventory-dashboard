# GitHub Copilot Instructions: LSG Plant Inventory Dashboard

## Project Overview

This is a **dual-platform plant inventory dashboard** for analyzing LSG (Life Sciences Group) plant data. The project implements both **Streamlit** and **Next.js** versions with **Supabase** integration for real-time data access.

### Key Architecture
- **Data Source**: Supabase PostgreSQL database with `plant_inventory` table
- **Dual Deployment**: Streamlit Cloud + Vercel for different use cases
- **Modern Patterns**: Uses `st.connection` pattern and TypeScript best practices

## Project Structure

```
GH-inventory-dashboard/
├── lsg_dashboard.py                    # Original Streamlit app (legacy)
├── lsg_dashboard_modern.py             # Modern Streamlit with st.connection
├── requirements.txt                    # Python dependencies (pandas>=2.2.0)
├── setup/                              # Database and connection utilities
│   └── check_supabase.py              # Supabase connection tester
├── nextjs-dashboard/                   # Complete Next.js implementation
│   ├── src/
│   │   ├── app/                       # Next.js 15 app router
│   │   ├── components/                # React components for charts/tables
│   │   ├── lib/                       # Supabase client and utilities
│   │   └── types/                     # TypeScript type definitions
│   ├── package.json                   # Node.js dependencies
│   └── tailwind.config.js             # Tailwind CSS configuration
└── .streamlit/                        # Streamlit configuration
    ├── secrets.toml.example           # Secrets template with dual format
    └── secrets.toml.template          # Legacy template
```

## Key Components & Patterns

### 1. Data Model (Critical Understanding)

**Primary Table**: `plant_inventory` in Supabase
```sql
-- Key columns for plant status calculation:
Plant #                                 -- Unique identifier
Group                                   -- Filter for 'LSG' group only
Standardized name (2nd tag by CJ)      -- Genotype identifier
Bench #                                 -- Physical location
Original date (date of soil transplanting from TC or cutting)  -- Plant date
Date cutback                           -- Optional cutback date
Date to killing bench                  -- Optional termination date
Termination date & composite site temp -- Additional termination info
Parent plant (for cuttings)           -- Parent reference
Other notes                            -- Free text notes
```

**Status Logic** (implements in both platforms):
```typescript/python
function getPlantStatus(plant) {
  if (plant['Date to killing bench'] || plant['Termination date & composite site temp']) {
    return 'Killed';
  } else if (plant['Date cutback']) {
    return 'Cut Back';
  }
  return 'Active';
}
```

### 2. Streamlit Architecture

**Modern Connection Pattern** (`lsg_dashboard_modern.py`):
```python
# Use st.connection for better caching and error handling
@st.cache_resource
def init_connection():
    return st.connection("supabase", type=SupabaseConnection)

@st.cache_data(ttl=300)  # 5-minute cache
def load_data():
    conn = init_connection()
    response = conn.query("*", table="plant_inventory", ttl="5m").execute()
```

**Secrets Format** (supports both patterns):
```toml
# Modern format (preferred)
[connections.supabase]
SUPABASE_URL = "your-url"
SUPABASE_KEY = "your-key"

# Legacy format (fallback)
[supabase]
SUPABASE_URL = "your-url"
SUPABASE_KEY = "your-key"
```

### 3. Next.js Architecture

**Type-Safe Data Layer**:
```typescript
// types/inventory.ts - Central type definitions
interface PlantInventory {
  'Plant #': number;
  'Group': string;
  'Standardized name (2nd tag by CJ)': string;
  // ... other fields
}

interface ProcessedPlant extends PlantInventory {
  status: 'Active' | 'Cut Back' | 'Killed';
  daysOld: number;
  needsAttention: boolean;
}
```

**Supabase Integration**:
```typescript
// lib/supabase.ts
export const fetchPlantInventory = async () => {
  const { data, error, count } = await supabase
    .from('plant_inventory')
    .select('*', { count: 'exact' })
    .eq('Group', 'LSG')  // Always filter for LSG group
    .order('Plant #', { ascending: true });
    
  if (error) throw new Error(`Database query failed: ${error.message}`);
  return data || [];
};
```

### 4. Component Architecture (Next.js)

**Modular Design**:
- `SummaryMetrics.tsx` - Metric cards with icons
- `FilterSection.tsx` - Dynamic filter dropdowns
- `GenotypeChart.tsx` - Horizontal bar chart (Recharts)
- `StatusChart.tsx` - Pie chart for status distribution
- `PlantTable.tsx` - Sortable data table

**Styling System**:
- Tailwind CSS with custom utility classes
- Component-specific styles in `globals.css`
- Consistent color scheme and spacing

## Development Guidelines

### 1. Data Processing Rules

**Always Filter for LSG Group**:
```python/typescript
# Python (Streamlit)
lsg_df = df[df['Group'] == 'LSG'].copy()

# TypeScript (Next.js)
.eq('Group', 'LSG')
```

**Status Calculation Priority**:
1. Check `Date to killing bench` or `Termination date & composite site temp` → "Killed"
2. Check `Date cutback` → "Cut Back"  
3. Default → "Active"

**Date Handling**:
```python
# Streamlit - Use pandas for date parsing
df['Original date (date of soil transplanting from TC or cutting)'] = pd.to_datetime(
    df['Original date (date of soil transplanting from TC or cutting)'], 
    errors='coerce'
)

# Next.js - Use date-fns for consistency
import { parseISO, format } from 'date-fns';
const date = parseISO(dateString);
```

### 2. Error Handling Patterns

**Streamlit Connection Hierarchy**:
1. Modern `st.connection` pattern (preferred)
2. Direct Supabase client (fallback)
3. Local CSV (emergency fallback)

**Next.js Error Boundaries**:
```typescript
try {
  const data = await fetchPlantInventory();
  setDataSource('Supabase Database');
} catch (err) {
  setError('Failed to load plant inventory data. Please check your connection.');
  // Could implement CSV fallback here
}
```

### 3. Performance Optimization

**Caching Strategy**:
- Streamlit: `@st.cache_data(ttl=300)` for data queries
- Next.js: Client-side filtering to reduce server calls
- Both: Optimize for large datasets (1000+ plants)

**Chart Performance**:
- Limit genotype charts to top 15 entries
- Use horizontal bar charts for better label readability
- Implement responsive design for mobile

### 4. Deployment Considerations

**Python Dependencies**:
```txt
# Critical: Use pandas>=2.2.0 for Python 3.13 compatibility
pandas>=2.2.0
numpy>=1.26.0
streamlit
plotly
supabase
st-supabase-connection
```

**Environment Variables**:
```bash
# Streamlit Cloud - Add to secrets
[connections.supabase]
SUPABASE_URL = "..."
SUPABASE_KEY = "..."

# Vercel - Add to dashboard
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Common Tasks & Solutions

### Adding New Visualizations

**Streamlit** (add to `lsg_dashboard_modern.py`):
```python
def plot_new_chart(df):
    # Use plotly for consistency
    fig = px.bar(data, x='column1', y='column2')
    st.plotly_chart(fig, use_container_width=True)
```

**Next.js** (create new component):
```typescript
// components/NewChart.tsx
import { ResponsiveContainer, BarChart } from 'recharts';

export default function NewChart({ data }: { data: any[] }) {
  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Title</h3>
      <ResponsiveContainer width="100%" height={400}>
        {/* Chart implementation */}
      </ResponsiveContainer>
    </div>
  );
}
```

### Database Schema Changes

1. **Update Supabase table structure**
2. **Modify TypeScript interfaces** in `types/inventory.ts`
3. **Update data processing** in `lib/utils.ts`
4. **Adjust Streamlit data parsing** in `load_data()` function

### Adding New Filters

**Streamlit**:
```python
# Add to sidebar
new_filter = st.sidebar.selectbox("New Filter:", options)

# Apply in filter logic
if new_filter != 'All':
    filtered_df = filtered_df[filtered_df['column'] == new_filter]
```

**Next.js**:
```typescript
// Update DashboardFilters type
interface DashboardFilters {
  genotype: string;
  status: string;
  bench: string;
  newFilter: string;  // Add new filter
}

// Add to FilterSection component
// Update filtering logic in page.tsx
```

### Debugging Connection Issues

**Test Supabase Connection**:
```bash
# Use the built-in checker
python setup/check_supabase.py

# Or test in Next.js
npm run dev
# Check browser console for connection errors
```

**Common Issues**:
1. **RLS Policies**: Ensure public read access for `plant_inventory` table
2. **API Keys**: Use anon key, not service role key for frontend
3. **CORS**: Supabase should allow localhost and your domains

## Code Quality Standards

### TypeScript (Next.js)
- Use strict mode: `"strict": true` in `tsconfig.json`
- Define interfaces for all data structures
- Handle null/undefined cases explicitly
- Use `const` assertions for literal types

### Python (Streamlit)
- Use type hints where possible
- Handle pandas warnings with `warnings.filterwarnings('ignore')`
- Cache expensive operations with `@st.cache_data`
- Use f-strings for string formatting

### CSS/Styling
- Use Tailwind utility classes consistently
- Define reusable component classes in `globals.css`
- Maintain responsive design (`md:`, `lg:` breakpoints)
- Use semantic color names (primary, success, warning, danger)

## Testing Considerations

### Manual Testing Checklist
- [ ] Data loads correctly from Supabase
- [ ] Filters work and combine properly
- [ ] Charts render with various data sizes
- [ ] Mobile responsiveness (Next.js)
- [ ] Error states display appropriately
- [ ] Cache invalidation works (refresh buttons)

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Filtering response < 500ms
- [ ] Large datasets (1000+ plants) handle gracefully
- [ ] Mobile performance acceptable

## Future Enhancements

### Potential Features
1. **Real-time Updates**: WebSocket integration for live data
2. **Data Export**: CSV/Excel download functionality
3. **Advanced Analytics**: Predictive modeling for plant lifecycles
4. **User Management**: Authentication and personalized dashboards
5. **Notifications**: Alerts for plants needing attention

### Technical Debt
1. **Unify Date Handling**: Standardize date parsing across platforms
2. **Error Logging**: Implement proper error tracking (Sentry)
3. **Testing Suite**: Add unit tests for data processing functions
4. **Documentation**: Auto-generate API docs from TypeScript types

---

## AI Assistant Guidelines

When working on this project:

1. **Always filter for LSG group** - This is critical for data integrity
2. **Maintain dual compatibility** - Changes should work in both Streamlit and Next.js
3. **Respect the data model** - The column names are fixed and come from the client
4. **Use modern patterns** - Prefer `st.connection` over direct Supabase client
5. **Consider mobile users** - Next.js implementation should be responsive
6. **Handle errors gracefully** - Always provide fallbacks and clear error messages
7. **Cache appropriately** - Balance performance with data freshness
8. **Follow existing conventions** - Match the established code style and patterns

The project is production-ready with both platforms offering different advantages for different use cases. Streamlit for rapid development and internal tools, Next.js for production-grade user experience and performance.

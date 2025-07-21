# LSG Plant Inventory Dashboard (Next.js)

A modern, responsive dashboard for managing and visualizing plant inventory data, built with Next.js and deployed on Vercel.

## Features

- 📊 Real-time data from Supabase database
- 🎯 Interactive charts and visualizations
- 🔍 Advanced filtering capabilities
- 📱 Responsive design for all devices
- ⚡ Fast loading with Next.js optimizations
- 🌐 Deployed on Vercel for optimal performance

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and database

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nextjs-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Make sure your Supabase database has a table named `plant_inventory` with the following columns:

- `id` (optional, auto-increment)
- `Plant #` (integer)
- `Group` (text)
- `Standardized name (2nd tag by CJ)` (text)
- `Bench #` (text or integer)
- `Original date (date of soil transplanting from TC or cutting)` (timestamp)
- `Date cutback` (timestamp, nullable)
- `Date to killing bench` (timestamp, nullable)
- `Termination date & composite site temp` (text, nullable)
- `Parent plant (for cuttings)` (text, nullable)
- `Other notes` (text, nullable)

## Deployment on Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
npx vercel --prod
```

## Features Overview

### Dashboard Components

- **Summary Metrics**: Total plants, unique genotypes, active/killed plant counts
- **Genotype Distribution**: Horizontal bar chart showing top 15 genotypes
- **Status Overview**: Pie chart displaying plant status distribution
- **Data Table**: Comprehensive plant inventory with sorting and filtering
- **Real-time Filters**: Dynamic filtering by genotype, status, and bench

### Data Processing

- Automatic status calculation based on dates
- Days old computation
- Data validation and error handling
- Fallback mechanisms for data loading

## Comparison with Streamlit Version

| Feature | Streamlit | Next.js |
|---------|-----------|---------|
| Performance | Good | Excellent |
| Mobile Responsive | Basic | Excellent |
| Customization | Limited | Full Control |
| Deployment | Streamlit Cloud | Vercel (faster) |
| Interactivity | Server-side | Client-side |
| SEO | Limited | Excellent |

## Project Structure

```
nextjs-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── FilterSection.tsx
│   │   ├── GenotypeChart.tsx
│   │   ├── PlantTable.tsx
│   │   ├── StatusChart.tsx
│   │   └── SummaryMetrics.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       └── inventory.ts
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

**Deprecation Warnings during npm install:**
- These are harmless warnings from transitive dependencies
- The project uses package overrides to minimize them
- Use `npm install --silent` to suppress warnings

**TypeScript Errors:**
- Make sure all dependencies are installed: `npm install`
- Check that your `.env.local` file is properly configured
- Run `npm run type-check` to see detailed TypeScript errors

**Build Errors:**
- Ensure environment variables are set in Vercel dashboard
- Check that your Supabase database schema matches the expected structure
- Run `npm run build` locally to test before deploying

**Supabase Connection Issues:**
- Verify your Supabase URL and API key in `.env.local`
- Check that the `plant_inventory` table exists with correct columns
- Ensure the Supabase project is not paused

## License

This project is licensed under the MIT License.

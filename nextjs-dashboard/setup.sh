#!/bin/bash

echo "🌱 Setting up LSG Plant Inventory Dashboard (Next.js)"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or later is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local from example if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials before running the app"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For deployment to Vercel:"
echo "1. Push your code to GitHub"
echo "2. Connect repository to Vercel"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "Happy coding! 🚀"

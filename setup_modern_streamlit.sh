#!/bin/bash

echo "🚀 Setting up Modern LSG Plant Inventory Dashboard"
echo "================================================="

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Python version: $PYTHON_VERSION"

# Install/upgrade required packages
echo "📦 Installing modern dependencies..."
pip install -q --upgrade streamlit pandas plotly numpy supabase st-supabase-connection

# Create secrets directory if it doesn't exist
if [ ! -d ".streamlit" ]; then
    mkdir .streamlit
    echo "📁 Created .streamlit directory"
fi

# Copy secrets template if secrets.toml doesn't exist
if [ ! -f ".streamlit/secrets.toml" ]; then
    if [ -f ".streamlit/secrets.toml.example" ]; then
        cp .streamlit/secrets.toml.example .streamlit/secrets.toml
        echo "🔧 Created secrets.toml from template"
        echo "⚠️  Please update .streamlit/secrets.toml with your Supabase credentials"
    else
        echo "❌ secrets.toml.example not found!"
    fi
fi

# Check if modern dashboard exists
if [ -f "lsg_dashboard_modern.py" ]; then
    echo "✅ Modern dashboard file found"
else
    echo "❌ lsg_dashboard_modern.py not found!"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .streamlit/secrets.toml with your Supabase credentials:"
echo "   [connections.supabase]"
echo "   SUPABASE_URL = \"your-supabase-url\""
echo "   SUPABASE_KEY = \"your-supabase-anon-key\""
echo ""
echo "2. Run the modern dashboard:"
echo "   streamlit run lsg_dashboard_modern.py"
echo ""
echo "3. For Streamlit Cloud deployment:"
echo "   - Use lsg_dashboard_modern.py as your main file"
echo "   - Copy the contents of .streamlit/secrets.toml to your Cloud secrets"
echo ""
echo "🌱 Happy plant monitoring!"

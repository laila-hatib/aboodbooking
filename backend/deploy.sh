#!/bin/bash

# Aboud Bus Booking System - Deployment Script

echo "🚀 Starting deployment process..."

# Create static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser (optional)..."
# python manage.py createsuperuser

echo "✅ Deployment setup complete!"
echo "🌐 Your Django backend is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your database (PostgreSQL recommended for production)"
echo "2. Configure environment variables from .env.example"
echo "3. Deploy to your hosting platform"
echo "4. Update frontend API URL to point to your backend"

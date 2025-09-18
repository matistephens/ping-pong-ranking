#!/bin/bash

echo "🏓 Setting up Ping Pong Tracker..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run db:generate

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:migrate

# Seed the database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"

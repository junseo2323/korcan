
#!/bin/bash
set -e

echo "🚀 Starting deployment of Featured Posts..."

# 1. Pull latest code (Simulated by rsync in this environment, but good for logs)
echo "📂 Syncing files..."

# 2. Install dependencies (if any new ones, though none added this time)
# npm install 

# 3. Generate Prisma Client (just in case)
echo "🗄️ Generating Prisma Client..."
npx prisma generate

# 4. Build data
echo "🌱 Seeding Featured Posts data..."
npx tsx scripts/seed-featured.ts
npx tsx scripts/seed-supporters.ts

# 5. Build application
echo "Modifying build memory limit..."
export NODE_OPTIONS="--max-old-space-size=2560"

echo "🏗️ Building Next.js app..."
npm run build

# 6. Restart PM2
echo "🔄 Restarting application..."
pm2 restart korcan

echo "✅ Deployment complete!"

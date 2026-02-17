
#!/bin/bash
set -e

echo "🚀 Starting SEO deployment..."

# 2. Sync Source Code (Full)
# 2. Sync Source Code (Full)
echo "📂 Syncing src folder..."
rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/ ubuntu@15.164.93.163:~/korcan-app/src/

echo "📂 Syncing config files..."
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" next.config.ts package.json package-lock.json prisma/ ubuntu@15.164.93.163:~/korcan-app/

# 3. (Skipped) Individual files are covered by full sync

# 4. Build & Restart
ssh -o StrictHostKeyChecking=no -i server-key.pem ubuntu@15.164.93.163 << 'ENDSSH'
  cd korcan-app
  export NODE_OPTIONS="--max-old-space-size=4096"
  
  # Clean up potential locks or stuck builds
  echo "🧹 Cleaning up locks..."
  rm -rf .next/lock
  pkill -f "next-build" || true
  
  echo "🏗️ Building Next.js app (SEO update)..."
  npm run build
  
  echo "🔄 Restarting application..."
  pm2 restart korcan
  
  echo "✅ SEO Deployment complete!"
ENDSSH

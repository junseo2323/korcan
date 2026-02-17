
#!/bin/bash
set -e

echo "🚀 Starting deployment of UX improvements..."

# 1. Sync Layout & Root Loading
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/app/layout.tsx src/app/loading.tsx ubuntu@15.164.93.163:~/korcan-app/src/app/

# 2. Sync UI Components (SplashScreen, Skeleton) to src/components/ui/
# Ensure the directory exists first just in case
ssh -o StrictHostKeyChecking=no -i server-key.pem ubuntu@15.164.93.163 "mkdir -p ~/korcan-app/src/components/ui"
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/components/ui/ ubuntu@15.164.93.163:~/korcan-app/src/components/ui/

# 3. Sync Route Loading States
# Ensure directories exist
ssh -o StrictHostKeyChecking=no -i server-key.pem ubuntu@15.164.93.163 "mkdir -p ~/korcan-app/src/app/community ~/korcan-app/src/app/market ~/korcan-app/src/app/expense ~/korcan-app/src/app/my"

rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/app/community/loading.tsx ubuntu@15.164.93.163:~/korcan-app/src/app/community/
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/app/market/loading.tsx ubuntu@15.164.93.163:~/korcan-app/src/app/market/
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/app/expense/loading.tsx ubuntu@15.164.93.163:~/korcan-app/src/app/expense/
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i server-key.pem" src/app/my/loading.tsx ubuntu@15.164.93.163:~/korcan-app/src/app/my/

# 4. Build & Restart
ssh -o StrictHostKeyChecking=no -i server-key.pem ubuntu@15.164.93.163 << 'ENDSSH'
  cd korcan-app
  export NODE_OPTIONS="--max-old-space-size=4096"
  
  echo "🏗️ Building Next.js app..."
  npm run build
  
  echo "🔄 Restarting application..."
  pm2 restart korcan
  
  echo "✅ Deployment complete!"
ENDSSH

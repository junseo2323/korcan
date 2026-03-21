# KorCan Project

## Google Analytics
- Measurement ID: `G-C6LJTH0WHF`
- Property ID: `529258217` (GA4 API용: `properties/529258217`)
- Account ID: `a388291075`

## 배포 프로세스

### 방식
**main 브랜치에 push하면 GitHub Actions가 자동으로 전체 배포를 처리한다.**
직접 서버에 rsync/ssh로 파일 복사하는 방식이 아님. 절대 그렇게 하지 말 것.

### 흐름
1. `git push origin main`
2. GitHub Actions (`.github/workflows/deploy.yml`) 자동 실행:
   - Docker 이미지 빌드 (`ghcr.io/junseo2323/korcan-web:latest`)
   - GHCR(GitHub Container Registry)에 push
   - EC2 서버에 SSH 접속 → 새 이미지 pull → `docker compose up -d`
   - DB 마이그레이션 실행 (`prisma db push`)
3. 진행 상황 확인: https://github.com/junseo2323/korcan/actions

### 서버 정보
- **IP**: `52.60.224.252` (AWS EC2, ca-central-1)
- **SSH 키**: `server-key.pem` (프로젝트 루트)
- **앱 경로**: `~/korcan/`
- **구성**: Docker Compose (`docker-compose.prod.yml`) — Next.js + Nginx
- **도메인**: https://korcan.cc

### 주의사항
- 서버에 Node.js/npm/pm2 직접 설치 안 되어 있음 → 모든 빌드는 Docker 내에서
- `~/korcan-app/` 디렉토리는 구버전 잔재, 실제 앱은 `~/korcan/`
- 구버전 배포 스크립트(`scripts/deploy-ux.sh` 등)는 현재 사용하지 않음

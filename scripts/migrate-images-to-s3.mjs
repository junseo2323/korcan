/**
 * 외부 이미지(unsplash, dicebear) → S3 업로드 → DB 업데이트 스크립트
 * 실행: node scripts/migrate-images-to-s3.mjs
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

// .env 수동 로드
const envPath = path.resolve(process.cwd(), '.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      const key = l.slice(0, idx).replace(/^export\s+/, '').trim()
      const val = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
      return [key, val]
    })
)

const REGION   = env.KORCAN_AWS_DEFAULT_REGION || 'ca-central-1'
const BUCKET   = env.KORCAN_AWS_S3_BUCKET_NAME
const DB_URL   = env.DATABASE_URL

if (!BUCKET) { console.error('❌ KORCAN_AWS_S3_BUCKET_NAME not set'); process.exit(1) }

process.env.DATABASE_URL = DB_URL

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId:     env.KORCAN_AWS_ACCESS_KEY_ID,
    secretAccessKey: env.KORCAN_AWS_SECRET_ACCESS_KEY,
  },
})

const prisma = new PrismaClient()

// ─── 업로드할 이미지 목록 ───────────────────────────────────────────────────
const IMAGES = {
  // 유저 아바타 (SVG)
  avatars: [
    { key: 'seeds/avatar-jihoon.svg',  url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=jihoon',  ct: 'image/svg+xml' },
    { key: 'seeds/avatar-soyeon.svg',  url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=soyeon',  ct: 'image/svg+xml' },
    { key: 'seeds/avatar-minsu.svg',   url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=minsu',   ct: 'image/svg+xml' },
    { key: 'seeds/avatar-hyejin.svg',  url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=hyejin',  ct: 'image/svg+xml' },
    { key: 'seeds/avatar-junho.svg',   url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=junho',   ct: 'image/svg+xml' },
  ],
  // 중고거래 상품 이미지 (JPG)
  products: [
    { key: 'seeds/product-1.jpg', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-2.jpg', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-3.jpg', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-4.jpg', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-5.jpg', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-6.jpg', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-7.jpg', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-8.jpg', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-9.jpg', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', ct: 'image/jpeg' },
    { key: 'seeds/product-10.jpg',url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80', ct: 'image/jpeg' },
  ],
  // 부동산 매물 이미지 (JPG)
  properties: [
    { key: 'seeds/property-1.jpg',  url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-2.jpg',  url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-3.jpg',  url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-4.jpg',  url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-5.jpg',  url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-6.jpg',  url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-7.jpg',  url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-8.jpg',  url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-9.jpg',  url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-10.jpg', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', ct: 'image/jpeg' },
    { key: 'seeds/property-11.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', ct: 'image/jpeg' },
  ],
}

function s3Url(key) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
}

async function downloadAndUpload(key, url, ct) {
  const dest = s3Url(key)
  process.stdout.write(`  ↓ ${key} ... `)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buf,
    ContentType: ct,
  }))
  console.log(`✅  ${dest}`)
  return dest
}

async function main() {
  console.log(`\n🪣  Bucket: ${BUCKET}  /  Region: ${REGION}\n`)

  // ── 1. 이미지 다운로드 + S3 업로드 ─────────────────────────────────────
  const urlMap = {}   // old URL → new S3 URL

  // 아바타
  const avatarItems = IMAGES.avatars
  const avatarEmails = [
    'seed_jihoon@korcan.cc', 'seed_soyeon@korcan.cc', 'seed_minsu@korcan.cc',
    'seed_hyejin@korcan.cc', 'seed_junho@korcan.cc',
  ]
  console.log('👤 Uploading avatars...')
  const avatarUrls = []
  for (const img of avatarItems) {
    const dest = await downloadAndUpload(img.key, img.url, img.ct)
    avatarUrls.push(dest)
    urlMap[img.url.replace('&q=80','').replace('?q=80','')] = dest
  }

  // 상품 이미지
  console.log('\n🛍️  Uploading product images...')
  const productUrls = []
  for (const img of IMAGES.products) {
    const dest = await downloadAndUpload(img.key, img.url, img.ct)
    productUrls.push(dest)
    // seed.ts의 URL은 q=80 없음
    const seedUrl = img.url.replace('&q=80','')
    urlMap[seedUrl] = dest
  }

  // 부동산 이미지
  console.log('\n🏠 Uploading property images...')
  const propertyUrls = []
  for (const img of IMAGES.properties) {
    const dest = await downloadAndUpload(img.key, img.url, img.ct)
    propertyUrls.push(dest)
    const seedUrl = img.url.replace('&q=80','')
    urlMap[seedUrl] = dest
  }

  // ── 2. DB 업데이트 ───────────────────────────────────────────────────────
  console.log('\n📦 Updating database...')

  // User 아바타
  const users = await prisma.user.findMany({
    where: { email: { in: avatarEmails } },
    select: { id: true, email: true, image: true },
  })
  for (const user of users) {
    const idx = avatarEmails.indexOf(user.email)
    if (idx !== -1 && avatarUrls[idx]) {
      await prisma.user.update({ where: { id: user.id }, data: { image: avatarUrls[idx] } })
      console.log(`  ✅ User ${user.email} → ${avatarUrls[idx]}`)
    }
  }

  // Product.imageUrl (순서대로 매핑)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, imageUrl: true },
  })
  for (let i = 0; i < products.length; i++) {
    const newUrl = productUrls[i % productUrls.length]
    await prisma.product.update({ where: { id: products[i].id }, data: { imageUrl: newUrl } })
    console.log(`  ✅ Product[${i+1}] → ${newUrl}`)
  }

  // PropertyImage.url (순서대로 매핑)
  const propImages = await prisma.propertyImage.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, url: true },
  })
  for (let i = 0; i < propImages.length; i++) {
    const newUrl = propertyUrls[i % propertyUrls.length]
    await prisma.propertyImage.update({ where: { id: propImages[i].id }, data: { url: newUrl } })
    console.log(`  ✅ PropertyImage[${i+1}] → ${newUrl}`)
  }

  console.log('\n🎉 Done! All images migrated to S3 and DB updated.\n')

  // URL 매핑 출력 (seed.ts 업데이트용)
  console.log('─── URL mapping (for seed.ts update) ───')
  console.log(JSON.stringify(urlMap, null, 2))

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })

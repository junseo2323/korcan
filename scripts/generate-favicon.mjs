import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// KorCan favicon SVG — maple red background, "KC" white text
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Background with rounded corners -->
  <rect width="32" height="32" rx="7" fill="#3366FF"/>

  <!-- Maple leaf shape (simplified) centered top -->
  <path d="M16 4
    L17.2 7.5 L20 6.5 L18.5 9.2 L21.5 9.5 L18.8 11.5 L20 15
    L16 13 L12 15 L13.2 11.5 L10.5 9.5 L13.5 9.2 L12 6.5 L14.8 7.5 Z"
    fill="white" opacity="0.9"/>
  <!-- Maple stem -->
  <rect x="15.2" y="14.5" width="1.6" height="2.5" fill="white" opacity="0.9"/>

  <!-- "KC" text -->
  <text x="16" y="27.5"
    font-family="Arial, Helvetica, sans-serif"
    font-size="9"
    font-weight="800"
    fill="white"
    text-anchor="middle"
    letter-spacing="0.5">KC</text>
</svg>`

async function generate() {
  const svgBuffer = Buffer.from(svg)
  const outDir = path.join(rootDir, 'src', 'app')

  // Generate PNG sizes needed for ICO
  const sizes = [16, 32, 48]
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  )

  // Save icon.svg for Next.js (served as /icon.svg)
  fs.writeFileSync(path.join(outDir, 'icon.svg'), svg)
  console.log('✅ icon.svg saved')

  // Save 32x32 PNG as apple-touch / OG fallback
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(rootDir, 'public', 'apple-touch-icon.png'))
  console.log('✅ apple-touch-icon.png (180x180) saved')

  // Build ICO file manually
  // ICO format: ICONDIR + ICONDIRENTRY[] + image data
  const icoBuffer = buildIco(pngBuffers, sizes)
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer)
  console.log('✅ favicon.ico (16, 32, 48px) saved')
}

function buildIco(pngBuffers, sizes) {
  const count = sizes.length
  const headerSize = 6 // ICONDIR
  const entrySize = 16 // ICONDIRENTRY per image
  const dataOffset = headerSize + entrySize * count

  // Calculate total buffer size
  const totalSize = dataOffset + pngBuffers.reduce((sum, buf) => sum + buf.length, 0)
  const buf = Buffer.alloc(totalSize)

  // ICONDIR header
  buf.writeUInt16LE(0, 0)      // reserved
  buf.writeUInt16LE(1, 2)      // type: 1 = ICO
  buf.writeUInt16LE(count, 4)  // image count

  let dataPos = dataOffset
  pngBuffers.forEach((png, i) => {
    const size = sizes[i]
    const entryOffset = headerSize + i * entrySize
    buf.writeUInt8(size === 256 ? 0 : size, entryOffset)      // width (0 = 256)
    buf.writeUInt8(size === 256 ? 0 : size, entryOffset + 1)  // height
    buf.writeUInt8(0, entryOffset + 2)   // color count
    buf.writeUInt8(0, entryOffset + 3)   // reserved
    buf.writeUInt16LE(1, entryOffset + 4) // color planes
    buf.writeUInt16LE(32, entryOffset + 6) // bits per pixel
    buf.writeUInt32LE(png.length, entryOffset + 8)  // image size
    buf.writeUInt32LE(dataPos, entryOffset + 12)    // image offset

    png.copy(buf, dataPos)
    dataPos += png.length
  })

  return buf
}

generate().catch(console.error)

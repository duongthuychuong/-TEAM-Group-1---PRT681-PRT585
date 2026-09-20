import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import sharp from "sharp"

const projectRoot = fileURLToPath(new URL("../", import.meta.url))
const importsDir = path.join(projectRoot, "src", "imports")
const outputDir = path.join(importsDir, "optimized")

async function writeImage(input, output, transform) {
  await mkdir(path.dirname(output), { recursive: true })
  await transform(sharp(input)).toFile(output)
}

await writeImage(
  path.join(importsDir, "Logo_The_Outback_F_B_Service_2.png"),
  path.join(outputDir, "logo.webp"),
  (image) => image.resize({ width: 480 }).webp({ lossless: true, effort: 6 }),
)

await writeImage(
  path.join(importsDir, "Logo_The_Outback_F_B_Service_2.png"),
  path.join(outputDir, "favicon.png"),
  (image) =>
    image
      .resize(64, 64, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 }),
)

await writeImage(
  path.join(importsDir, "banhmi.png"),
  path.join(outputDir, "banhmi.webp"),
  (image) => image.webp({ quality: 82, alphaQuality: 95, effort: 6 }),
)

await writeImage(
  path.join(importsDir, "catering.png"),
  path.join(outputDir, "catering.webp"),
  (image) => image.webp({ quality: 82, effort: 6 }),
)

console.log("Optimized hero, logo, favicon, and catering images.")

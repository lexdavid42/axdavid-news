import sharp from "sharp";
import { readdir, mkdir, access } from "node:fs/promises";
import path from "node:path";

const RAW = "src/raw-images";
const OUT = "src/images";
const BADGE = "src/assets/logo-badge.png";
const W = 1600, H = 900;

await mkdir(OUT, { recursive: true });
const files = (await readdir(RAW)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const badgeW = Math.round(W * 0.15);
const badge = await sharp(BADGE).resize({ width: badgeW }).png().toBuffer();
const { height: badgeH } = await sharp(badge).metadata();
const margin = Math.round(W * 0.025);

for (const f of files) {
  const out = path.join(OUT, f.replace(/\.(png|jpe?g|webp)$/i, ".jpg"));
  try { await access(out); continue; } catch {}
  await sharp(path.join(RAW, f))
    .resize(W, H, { fit: "cover", position: "attention" })
    .composite([{ input: badge, left: W - badgeW - margin, top: H - badgeH - margin }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  console.log("branded", out);
}

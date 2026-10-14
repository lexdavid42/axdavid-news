import { readdir, mkdir, access, copyFile } from "node:fs/promises";
import path from "node:path";

const RAW = "src/raw-images";
const OUT = "src/images";
const BADGE = "src/assets/logo-badge.png";
const W = 1600, H = 900;

await mkdir(OUT, { recursive: true });
const files = (await readdir(RAW)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch (err) {
  console.warn("sharp unavailable, copying images without badge:", err.message);
}

let badge, badgeW, badgeH, margin;
if (sharp) {
  badgeW = Math.round(W * 0.15);
  badge = await sharp(BADGE).resize({ width: badgeW }).png().toBuffer();
  badgeH = (await sharp(badge).metadata()).height;
  margin = Math.round(W * 0.025);
}

for (const f of files) {
  const src = path.join(RAW, f);
  const out = path.join(OUT, f.replace(/\.(png|jpe?g|webp)$/i, ".jpg"));
  try { await access(out); continue; } catch {}
  try {
    if (!sharp) throw new Error("no sharp");
    await sharp(src)
      .resize(W, H, { fit: "cover", position: "attention" })
      .composite([{ input: badge, left: W - badgeW - margin, top: H - badgeH - margin }])
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(out);
    console.log("branded", out);
  } catch (err) {
    console.warn("fallback copy for", f, err.message);
    await copyFile(src, out);
  }
}

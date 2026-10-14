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
    if (!sharp || process.env.FORCE_JIMP) throw new Error("no sharp");
    await sharp(src)
      .resize(W, H, { fit: "cover", position: "attention" })
      .composite([{ input: badge, left: W - badgeW - margin, top: H - badgeH - margin }])
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(out);
    console.log("branded", out);
  } catch (err) {
    console.warn("sharp failed for", f, err.message, "- trying jimp");
    try {
      const { Jimp } = await import("jimp");
      const img = await Jimp.read(src);
      img.cover({ w: W, h: H });
      const b = await Jimp.read(BADGE);
      const bw = Math.round(W * 0.15);
      b.resize({ w: bw });
      const m = Math.round(W * 0.025);
      img.composite(b, W - bw - m, H - b.bitmap.height - m);
      await img.write(out, { quality: 84 });
      console.log("branded (jimp)", out);
    } catch (err2) {
      console.warn("fallback copy for", f, err2.message);
      await copyFile(src, out);
    }
  }
}

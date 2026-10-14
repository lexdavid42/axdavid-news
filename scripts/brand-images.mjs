// Prepares cover images: crops raw AI images to 1600x900 JPG. No logo overlay (editorial style).
import { readdir, mkdir, access, copyFile } from "node:fs/promises";
import path from "node:path";

const RAW = "src/raw-images";
const OUT = "src/images";
const W = 1600, H = 900;

await mkdir(OUT, { recursive: true });
const files = (await readdir(RAW)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch (err) {
  console.warn("sharp unavailable, will try jimp:", err.message);
}

for (const f of files) {
  const src = path.join(RAW, f);
  const out = path.join(OUT, f.replace(/\.(png|jpe?g|webp)$/i, ".jpg"));
  try { await access(out); continue; } catch {}
  try {
    if (!sharp || process.env.FORCE_JIMP) throw new Error("no sharp");
    await sharp(src)
      .resize(W, H, { fit: "cover", position: "attention" })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(out);
    console.log("prepared", out);
  } catch (err) {
    console.warn("sharp failed for", f, err.message, "- trying jimp");
    try {
      const { Jimp } = await import("jimp");
      const img = await Jimp.read(src);
      img.cover({ w: W, h: H });
      await img.write(out, { quality: 86 });
      console.log("prepared (jimp)", out);
    } catch (err2) {
      console.warn("fallback copy for", f, err2.message);
      await copyFile(src, out);
    }
  }
}

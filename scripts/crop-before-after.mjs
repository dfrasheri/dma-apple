// Split a vertically-stacked before/after composite into two images.
// Usage: node scripts/crop-before-after.mjs <input.jpg> [seamHint 0-1]
// Writes <input>-before.jpg (top) and <input>-after.jpg (bottom) next to the input.
// The seam is auto-detected as the strongest row-to-row discontinuity near the
// hint (default 0.5); contiguous solid divider rows around it are dropped from
// both halves.
import sharp from "sharp";
import path from "node:path";

const [, , input, hintArg] = process.argv;
if (!input) {
  console.error("usage: node scripts/crop-before-after.mjs <input.jpg> [seamHint]");
  process.exit(1);
}
const hint = hintArg ? parseFloat(hintArg) : 0.5;

const img = sharp(input);
const { width, height } = await img.metadata();
const { data } = await img
  .clone()
  .raw()
  .toBuffer({ resolveWithObject: true });
const ch = data.length / (width * height); // channels

const rowMean = (y) => {
  let r = 0;
  const off = y * width * ch;
  for (let x = 0; x < width * ch; x++) r += data[off + x];
  return r / (width * ch);
};

// Mean absolute difference between adjacent rows.
const rowDiff = (y) => {
  let d = 0;
  const a = y * width * ch;
  const b = (y + 1) * width * ch;
  for (let x = 0; x < width * ch; x++) d += Math.abs(data[a + x] - data[b + x]);
  return d / (width * ch);
};

// Row uniformity: stddev of pixel values across the row (solid divider ≈ 0).
const rowStd = (y) => {
  const off = y * width * ch;
  const mean = rowMean(y);
  let v = 0;
  for (let x = 0; x < width * ch; x++) v += (data[off + x] - mean) ** 2;
  return Math.sqrt(v / (width * ch));
};

// Search ±15% of height around the hint for the sharpest horizontal edge.
const lo = Math.max(1, Math.floor(height * (hint - 0.15)));
const hi = Math.min(height - 2, Math.ceil(height * (hint + 0.15)));
let seam = Math.floor(height * hint);
let best = -1;
for (let y = lo; y <= hi; y++) {
  const d = rowDiff(y);
  if (d > best) {
    best = d;
    seam = y;
  }
}

// Drop any solid divider band touching the seam (uniform rows).
let topEnd = seam; // last row (inclusive) of the top half
let bottomStart = seam + 1; // first row of the bottom half
while (topEnd > lo && rowStd(topEnd) < 8) topEnd--;
while (bottomStart < hi && rowStd(bottomStart) < 8) bottomStart++;

const base = input.replace(/\.jpg$/i, "");
const beforeOut = `${base}-before.jpg`;
const afterOut = `${base}-after.jpg`;

await sharp(input)
  .extract({ left: 0, top: 0, width, height: topEnd + 1 })
  .jpeg({ quality: 90 })
  .toFile(beforeOut);
await sharp(input)
  .extract({ left: 0, top: bottomStart, width, height: height - bottomStart })
  .jpeg({ quality: 90 })
  .toFile(afterOut);

console.log(
  JSON.stringify({
    input: path.basename(input),
    width,
    height,
    seam,
    seamFraction: +(seam / height).toFixed(3),
    edgeStrength: +best.toFixed(1),
    top: `0..${topEnd}`,
    bottom: `${bottomStart}..${height - 1}`,
    before: path.basename(beforeOut),
    after: path.basename(afterOut),
  }),
);

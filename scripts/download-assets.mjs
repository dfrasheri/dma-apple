// Downloads real image assets from the target site into public/images.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.thepaddingtondentalsurgery.com.au';
const OUT = new URL('../public/images/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const paths = [
  // hero slides
  '/wp-content/uploads/2025/08/bg-home-header-1.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-2.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-3.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-4.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-5.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-6.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-7.jpg',
  '/wp-content/uploads/2025/08/bg-home-header-8.jpg',
  '/wp-content/uploads/2026/02/Front-Office.jpg',
  '/wp-content/uploads/2026/01/Dr-Header-Image.jpg',
  '/wp-content/uploads/2026/02/Patient-Couple-Smiling.jpg',
  // procedures
  '/wp-content/uploads/2025/05/fcs-happy-patient.jpg',
  '/wp-content/uploads/2026/02/0F1A5487-1.jpg',
  '/wp-content/uploads/2026/02/0F1A1042-2.jpg',
  '/wp-content/uploads/2025/06/treatments-orthodontic.jpg',
  // office tour
  '/wp-content/uploads/2025/06/office-tour-4.jpg',
  '/wp-content/uploads/2025/06/office-tour-5.jpg',
  '/wp-content/uploads/2025/06/office-tour-6.jpg',
  '/wp-content/uploads/2025/06/office-tour-7.jpg',
  '/wp-content/uploads/2025/06/office-tour-8.jpg',
  '/wp-content/uploads/2025/06/office-tour-9.jpg',
  '/wp-content/uploads/2025/06/office-tour-10.jpg',
  '/wp-content/uploads/2025/06/office-tour-11.jpg',
  '/wp-content/uploads/2025/06/office-tour-12.jpg',
  // feature cards
  '/wp-content/uploads/2025/06/technology-patient-xray.jpg',
  '/wp-content/uploads/2025/06/painfree-experience.jpg',
  // smile gallery + holistic
  '/wp-content/uploads/2025/01/home-bg-dental-makeovers.jpg',
  '/wp-content/uploads/2025/06/holistic-dental-care.jpg',
];

const flat = (p) => p.split('/').pop();

async function get(p) {
  const url = BASE + p;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) { console.log(`SKIP ${res.status} ${p}`); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = join(OUT, flat(p));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    console.log(`OK ${(buf.length/1024).toFixed(0)}KB ${flat(p)}`);
  } catch (e) { console.log(`ERR ${p} ${e.message}`); }
}

async function run() {
  await mkdir(OUT, { recursive: true });
  for (let i = 0; i < paths.length; i += 4) {
    await Promise.all(paths.slice(i, i + 4).map(get));
  }
  console.log('done');
}
run();

import { writeFileSync } from "node:fs";

const PORT = 9223;
const PAGE = process.argv[2] ?? "http://localhost:9999/catalogue/emax-crown";
const OUT = process.argv[3] ?? "docs/design-references/dma-orbit.png";
const DY = Number(process.argv[4] ?? 150); // vertical drag (px); + = drag up -> look down at top

const targets = await (await fetch(`http://localhost:${PORT}/json`)).json();
const target = targets.find((t) => t.type === "page");
if (!target) throw new Error("no page target");

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  }
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evalJs = async (expression) => (await send("Runtime.evaluate", { returnByValue: true, expression })).result?.value;

await new Promise((r) => ws.addEventListener("open", r));
await send("Page.enable");
await send("Runtime.enable");
await send("Input.enable").catch(() => {});
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: PAGE });
await sleep(3000);
await send("Runtime.evaluate", { expression: "document.querySelector('[role=img]')?.scrollIntoView({block:'center'})" });

let okSized = false;
for (let i = 0; i < 120; i++) {
  const w = await evalJs("(()=>{const c=document.querySelector('canvas');return c?c.width:0;})()");
  if (w && w > 400) { okSized = true; break; }
  await sleep(750);
}
if (!okSized) { console.error("ERROR: canvas never sized"); ws.close(); process.exit(1); }
await send("Runtime.evaluate", { expression: "document.querySelector('canvas')?.scrollIntoView({block:'center'})" });
await sleep(1500);

const r = JSON.parse(
  await evalJs("(()=>{const c=document.querySelector('canvas');const r=c.getBoundingClientRect();return JSON.stringify({x:r.x,y:r.y,w:r.width,h:r.height,sx:window.scrollX,sy:window.scrollY});})()"),
);
const cx = r.x + r.w / 2;
const cy = r.y + r.h / 2;

// drag up from canvas center to orbit the camera over the top (look down at the occlusal)
await send("Input.dispatchMouseEvent", { type: "mousePressed", x: cx, y: cy, button: "left", buttons: 1, clickCount: 1 });
for (let s = 1; s <= 12; s++) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: cx, y: cy - (DY * s) / 12, button: "left", buttons: 1 });
  await sleep(30);
}
await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: cx, y: cy - DY, button: "left", buttons: 1, clickCount: 1 });
await sleep(2500); // settle damping + render frames

const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: r.x + r.sx, y: r.y + r.sy, width: r.w, height: r.h, scale: 2 },
});
writeFileSync(OUT, Buffer.from(shot.data, "base64"));
console.log("saved", OUT, "(drag dy=" + DY + ")");
ws.close();

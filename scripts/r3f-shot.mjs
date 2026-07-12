import { writeFileSync } from "node:fs";

const PORT = 9223;
const PAGE = process.argv[2] ?? "http://localhost:9999/catalogue/single-implant-crown";
const OUT = process.argv[3] ?? "docs/design-references/dma-implant3d-cdp.png";

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

await new Promise((r) => ws.addEventListener("open", r));
await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
// reduced-motion -> implant defaults to the exploded state so labels fan out
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: PAGE });
await sleep(3000); // initial hydrate

// Drive the IntersectionObserver mount-gate: scroll the always-present 3D stage
// ([role=img] wrapper) into view BEFORE polling (this works even when no canvas exists yet).
await send("Runtime.evaluate", { expression: "document.querySelector('[role=img]')?.scrollIntoView({block:'center'})" });

// Poll until a REAL, sized WebGL canvas exists. On a cold Turbopack server the dynamic
// ImplantScene chunk (three + drei + postprocessing) + SwiftShader init can take far longer
// than any fixed sleep, so we gate on canvas.width>0 instead of guessing a duration.
let ready = false;
for (let i = 0; i < 120; i++) {
  const p = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: "(()=>{const c=document.querySelector('canvas');return c&&c.width>0?(c.width+'x'+c.height):'';})()",
  });
  if (p.result?.value) {
    ready = true;
    console.log("canvas ready:", p.result.value, "after ~" + (i * 0.75).toFixed(1) + "s");
    break;
  }
  await sleep(750);
}
if (!ready) {
  console.error("ERROR: canvas never mounted within ~90s — failing loud instead of saving a poster frame");
  ws.close();
  process.exit(1);
}

// re-center and let a few frames settle for a stable shot
await send("Runtime.evaluate", { expression: "document.querySelector('canvas')?.scrollIntoView({block:'center'})" });
await sleep(1800);

const probe = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: "(()=>{const c=document.querySelector('canvas');return JSON.stringify({hasCanvas:!!c,w:c?c.width:0,h:c?c.height:0});})()",
});
console.log("probe:", probe.result?.value);

const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(OUT, Buffer.from(shot.data, "base64"));
console.log("saved", OUT);
ws.close();

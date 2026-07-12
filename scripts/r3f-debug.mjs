import { writeFileSync } from "node:fs";

const PORT = 9223;
const PAGE = process.argv[2] ?? "http://localhost:9999/catalogue/single-implant-crown";
const OUT = process.argv[3] ?? "docs/design-references/dma-r3f-debug.png";

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
const logs = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  } else if (m.method === "Runtime.consoleAPICalled") {
    logs.push(`[${m.params.type}] ` + m.params.args.map((a) => a.value ?? a.description ?? a.type).join(" "));
  } else if (m.method === "Runtime.exceptionThrown") {
    const ex = m.params.exceptionDetails;
    logs.push("[EXCEPTION] " + (ex.exception?.description ?? ex.text));
  }
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await new Promise((r) => ws.addEventListener("open", r));
await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: PAGE });
await sleep(6000);
await send("Runtime.evaluate", { expression: "window.scrollTo(0, Math.round(document.body.scrollHeight*0.18))" });
await sleep(20000);
await send("Runtime.evaluate", { expression: "const c=document.querySelector('canvas'); if(c) c.scrollIntoView({block:'center'});" });
await sleep(6000);

const probe = await send("Runtime.evaluate", {
  returnByValue: true,
  expression:
    "(()=>{const c=document.querySelector('canvas');const secs=[...document.querySelectorAll('section')].length;return JSON.stringify({hasCanvas:!!c,w:c?c.width:0,h:c?c.height:0,sections:secs,bodyH:document.body.scrollHeight});})()",
});
console.log("probe:", probe.result?.value);
console.log("--- console/exceptions ---");
console.log(logs.length ? logs.join("\n") : "(none)");

const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(OUT, Buffer.from(shot.data, "base64"));
console.log("saved", OUT);
ws.close();

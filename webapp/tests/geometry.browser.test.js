// Run with Playwright installed, or PLAYWRIGHT_MODULE_PATH pointing to its index.mjs.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, extname } from "node:path";
import { instantiate } from "../tasks/bank/index.js";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : "playwright");
const dir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const server = createServer(async (req, res) => {
  try {
    const path = resolve(dir, "." + decodeURIComponent(req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0]));
    if (!path.startsWith(dir + "/")) throw Error("path");
    res.setHeader("Content-Type", { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" }[extname(path)] || "text/plain");
    res.end(await readFile(path));
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${url}/?preview=1#tasks`);
  await page.locator("#taskSetup").waitFor();
  await page.locator("[name=topics][value=planeGeometry]").check();
  await page.locator("[name=minutes]").fill("180");
  await page.locator("[name=short]").fill("20");
  await page.locator("[name=medium]").fill("20");
  await page.locator("[name=complex]").fill("20");
  await page.locator("[name=useHistory]").uncheck();
  await page.locator("[name=seed]").fill("geometry-browser-all");
  await page.locator("#taskSetup button[type=submit]").click();

  const session = await page.evaluate(() => JSON.parse(localStorage.getItem("christian-matematik.tasks.v1")).session);
  assert.equal(session.items.length, 30);
  assert.deepEqual(new Set(session.items.map((item) => instantiate(item.id, session.seed).module)), new Set(["geo.1", "geo.2", "geo.3", "geo.4", "geo.5"]));

  for (let index = 0; index < session.items.length; index++) {
    const record = session.items[index];
    const task = instantiate(record.id, session.seed);
    await page.locator("[data-task-action=jump]").nth(index).click();
    assert.equal(await page.locator(".task-question math").evaluateAll((nodes) => nodes.every((node) => node.namespaceURI === "http://www.w3.org/1998/Math/MathML")), true);
    for (const part of task.parts) {
      const field = page.locator(`.task-question [data-part="${part.id}"]`);
      if (part.type === "choice") await page.locator(`.task-question [data-part="${part.id}"][value="${part.answer}"]`).check();
      else if (["tuple", "set"].includes(part.type)) {
        for (let component = 0; component < part.answer.length; component++)
          await page.locator(`.task-question [data-part="${part.id}"][data-component="${component}"]`).fill(String(part.answer[component]));
      } else await field.fill(
        part.type === "text"
          ? "Jeg kontrollerer punkt, radius, vinkelrethed og antal fælles punkter."
          : task.id === "geo.walk" && part.id === "length"
            ? String(task.parameters.length ** 2)
            : String(part.answer),
      );
    }
    if (task.id === "geo.walk") {
      await page.locator("[data-task-action=hint]").click();
      assert.equal(await page.locator(".task-question .hint").count(), 1);
    }
    await page.locator("[data-task-action=check]").click();
    const result = await page.locator(".task-question .task-feedback").innerText();
    if (task.id === "geo.walk") assert.match(result, /kvadrat/i, task.id);
    else if (task.parts.some((part) => part.type !== "text")) assert.match(result, /Det passer/i, task.id);
    if (task.parts.some((part) => part.type === "text")) assert.match(result, /Faglig tjekliste/i, task.id);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (let index = 0; index < session.items.length; index++) {
    await page.locator("[data-task-action=jump]").nth(index).click();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }
  assert.deepEqual(errors, []);
  console.log("Geometry browser tests passed: all 30 tasks, answers, grading, targeted feedback, hints, MathML and mobile layout; no console errors.");
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}

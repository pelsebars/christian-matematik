// Run with Playwright installed, or PLAYWRIGHT_MODULE_PATH pointing to its index.mjs.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, extname } from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href
    : "playwright"
);
const dir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const server = createServer(async (req, res) => {
  try {
    const p = resolve(
      dir,
      "." +
        decodeURIComponent(
          req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0],
        ),
    );
    if (!p.startsWith(dir + "/")) throw Error("path");
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      }[extname(p)] || "text/plain",
    );
    res.end(await readFile(p));
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL
    ? { channel: process.env.BROWSER_CHANNEL }
    : {}),
});
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(url);
  await page.locator("#tasksView form").waitFor({ state: "attached" });
  // Existing pages and one existing exercise remain interactive.
  for (const view of [
    "equations",
    "quadratic",
    "composite",
    "differentiation",
    "planeGeometry",
    "formulas",
    "home",
  ]) {
    await page.locator(`.nav-item[data-view="${view}"]`).click();
    assert.equal(
      await page
        .locator(
          view === "home"
            ? "[data-page=home]"
            : view === "formulas"
              ? "[data-page=formulas]"
              : "[data-page=subject]",
        )
        .isVisible(),
      true,
    );
  }
  await page.locator(".nav-item[data-view=equations]").click();
  const oldCard = page.locator("#equationLesson .exercise-card").first();
  await oldCard.locator("input").first().fill("3");
  await oldCard.locator(".check-answer").click();
  assert.ok(await oldCard.locator(".answer-feedback").textContent());
  await page.locator(".nav-item[data-view=tasks]").click();
  await page.locator("[name=mode]").selectOption("exam");
  await page.locator("[name=timer]").check();
  await page.locator("[name=useHistory]").uncheck();
  await page.locator("[name=seed]").fill("browser-exam");
  await page.locator("#taskSetup button[type=submit]").click();
  const examCount = await page.locator("[data-task-action=jump]").count();
  assert.ok(examCount > 0 && examCount <= 12);
  assert.equal(await page.locator("[data-task-action=hint]").count(), 0);
  assert.equal(await page.locator(".task-feedback").count(), 0);
  assert.equal(await page.locator("#taskTimer").count(), 1);
  const active = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("christian-matematik.tasks.v1")).session,
  );
  await page
    .locator("[data-task-action=jump]")
    .nth(
      active.items.findIndex(
        (r, i) => r.id !== "geo.angle" && i < active.items.length - 1,
      ),
    )
    .click();
  await page.locator(".task-question [data-part]").first().fill("123");
  await page.locator("[data-task-action=mark]").click();
  await page.locator("[data-task-action=next]").click();
  await page.locator("[data-task-action=previous]").click();
  assert.equal(
    await page.locator(".task-question [data-part]").first().inputValue(),
    "123",
  );
  await page.reload();
  await page.locator(".task-question").waitFor();
  assert.equal(
    await page.locator(".task-question [data-part]").first().inputValue(),
    "123",
  );
  assert.equal(
    await page.locator("[data-task-action=mark]").getAttribute("aria-pressed"),
    "true",
  );
  // No topic, module, goals, hints or solutions are rendered in the active exam.
  for (const forbidden of [
    "Gennemregnet løsning",
    "Læringsmål",
    "Produktreglen",
    "Skalarprodukt og vinkler",
    "Afventer egen vurdering",
  ])
    assert.ok(
      !(await page.locator("#tasksView").innerText()).includes(forbidden),
    );
  await page.locator("[data-task-action=finish]").click();
  assert.ok(await page.locator(".task-confirm").isVisible());
  await page.locator("[data-task-action=cancel]").click();
  await page.locator("[data-task-action=finish]").click();
  await page.locator("[data-task-action=submit]").click();
  assert.ok(
    (await page.locator("#tasksView").innerText()).includes(
      "Fordelt på læringsmål",
    ),
  );
  assert.equal(await page.locator(".task-feedback").count(), examCount);
  await page.locator("[data-task-action=retry]").click();
  assert.ok(
    (await page.locator("#taskHeading").innerText()).includes(
      "Blandet træning",
    ),
  );
  await page.locator("[data-task-action=hint]").click();
  assert.equal(await page.locator(".task-question .hint").count(), 1);
  await page.reload();
  await page.locator(".task-question").waitFor();
  assert.equal(await page.locator(".task-question .hint").count(), 1);
  await page.locator("[data-task-action=check]").click();
  assert.ok(await page.locator(".task-feedback").isVisible());
  assert.ok(
    await page.locator(".task-question [data-part]").first().isDisabled(),
  );
  // Finish, then run a focused set with exact partial scores and manual review.
  await page.locator("[data-task-action=finish]").click();
  await page.locator("[data-task-action=submit]").click();
  await page.locator("[data-task-action=new]").click();
  await page.locator("[name=topics][value=quadratic]").check();
  await page.locator("[name=useHistory]").uncheck();
  await page.locator("#taskSetup button[type=submit]").click();
  await page.locator("[data-part=d]").fill("2");
  await page.locator('[data-part=roots][data-component="0"]').fill("2");
  await page.locator('[data-part=roots][data-component="1"]').fill("2");
  await page.locator("[data-task-action=check]").click();
  assert.match(
    await page.locator(".task-feedback").innerText(),
    /1 af 2 point/,
  );
  await page.locator("[data-task-action=finish]").click();
  await page.locator("[data-task-action=submit]").click();
  assert.equal(await page.locator(".task-score").innerText(), "3 af 4 point");
  await page.locator("[data-task-action=new]").click();
  await page.locator("[name=topics][value=differentiation]").check();
  await page.locator("[name=difficulty]").selectOption("3");
  await page.locator("#taskSetup button[type=submit]").click();
  await page
    .locator("[data-part=reason]")
    .fill("Jeg undersøger fortegnsskift og interval.");
  await page.locator("[data-task-action=check]").click();
  assert.ok(
    (await page.locator(".task-feedback").innerText()).includes(
      "Faglig tjekliste",
    ),
  );
  await page.locator("[data-self-part=reason]").selectOption("2");
  await page.locator("[data-task-action=finish]").click();
  await page.locator("[data-task-action=submit]").click();
  assert.equal(await page.locator(".task-score").innerText(), "2 af 9 point");
  await page.locator("[data-task-action=repeat-module]").first().click();
  assert.equal(await page.locator("#differentiationLesson").isVisible(), true);
  // Mobile, MathML namespace, SVG and keyboard focus.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#menuButton").click();
  await page.locator(".nav-item[data-view=tasks]").click();
  assert.equal(
    await page.locator("#menuButton").getAttribute("aria-expanded"),
    "false",
  );
  await page.locator("[data-task-action=new]").click();
  await page.locator("[name=topics][value=planeGeometry]").check();
  await page.locator("[name=aids]").selectOption("no");
  await page.locator("#taskSetup button[type=submit]").click();
  for (
    let i = 0;
    i < (await page.locator("[data-task-action=jump]").count());
    i++
  ) {
    await page.locator("[data-task-action=jump]").nth(i).click();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    );
  }
  assert.equal(
    await page
      .locator(".task-question math")
      .first()
      .evaluate((el) => el.namespaceURI),
    "http://www.w3.org/1998/Math/MathML",
  );
  await page.locator("[data-task-action=jump]").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page
      .locator("#taskHeading")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(250);
  await page.screenshot({
    path: "/tmp/matematik-tasks-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(250);
  await page.screenshot({
    path: "/tmp/matematik-tasks-desktop.png",
    fullPage: true,
  });
  // Complex worked mathematics remains readable on a narrow screen.
  await page.locator('[data-task-action=finish]').click();
  await page.locator('[data-task-action=submit]').click();
  await page.locator('[data-task-action=new]').click();
  await page.locator('[name=topics][value=differentiation]').check();
  await page.locator('[name=difficulty]').selectOption('3');
  await page.locator('#taskSetup button[type=submit]').click();
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-task-action=check]').click();
  assert.ok(await page.locator('.task-feedback math').evaluateAll(elements => elements.every(el => el.getBoundingClientRect().right <= window.innerWidth)));
  await page.screenshot({path:'/tmp/matematik-tasks-solution-mobile.png',fullPage:true});
  // Blocked storage is visible, without an uncaught exception.
  const blocked = await browser.newContext();
  await blocked.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("blocked");
      },
    }),
  );
  const bp = await blocked.newPage();
  bp.on("pageerror", (e) => errors.push(e.message));
  await bp.goto(url + "/#tasks");
  await bp.locator("#taskSetup button[type=submit]").click();
  assert.match(await bp.locator("#taskSave").innerText(), /kan ikke gemme/);
  assert.deepEqual(errors, []);
  console.log(
    "Browser tests passed: existing pages, exam privacy, answer persistence, hints, partial scores, manual review, repetition, mobile, MathML, keyboard, blocked storage, no console errors.",
  );
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}

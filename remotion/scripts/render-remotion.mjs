import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compositionId = process.argv[2] || "main";
const outputName = process.argv[3] || "output.mp4";

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

async function renderComp(id, output) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id,
    puppeteerInstance: browser,
  });
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: output,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log(`Done: ${output}`);
}

if (compositionId === "all") {
  const videos = [
    ["protect", "/dev-server/public/videos/finder-id-protection.mp4"],
    ["nfc", "/dev-server/public/videos/finder-id-nfc-mcard.mp4"],
    ["story", "/dev-server/public/videos/finder-id-temoignage.mp4"],
  ];
  for (const [id, out] of videos) {
    await renderComp(id, out);
  }
} else {
  await renderComp(compositionId, `/mnt/documents/${outputName}`);
}

await browser.close({ silent: false });
console.log("All rendering complete!");

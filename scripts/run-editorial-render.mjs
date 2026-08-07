import { appendFileSync, writeFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const port = 9238;
const outputDirectory = fileURLToPath(new URL("../public/videos/kanso/", import.meta.url));
const outputFile = fileURLToPath(
  new URL("../public/videos/kanso/editorial-ritual.mp4", import.meta.url),
);
const renderPage = "http://127.0.0.1:8009/scripts/render-editorial-video.html";

async function sendCommand(socketUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(socketUrl);
    const id = 1;

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ id, method, params }));
    });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      socket.close();
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
    socket.addEventListener("error", reject);
  });
}

const browserInfo = await fetch(`http://127.0.0.1:${port}/json/version`).then((response) =>
  response.json(),
);
await sendCommand(browserInfo.webSocketDebuggerUrl, "Browser.setDownloadBehavior", {
  behavior: "allow",
  downloadPath: outputDirectory,
  eventsEnabled: true,
});

const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
const page = pages.find((candidate) => candidate.type === "page");
if (!page) throw new Error("No Chrome page target is available");

await sendCommand(page.webSocketDebuggerUrl, "Page.navigate", { url: renderPage });

const deadline = Date.now() + 45_000;
let isDone = false;
while (!isDone && Date.now() < deadline) {
  const title = await sendCommand(page.webSocketDebuggerUrl, "Runtime.evaluate", {
    expression: "document.title",
    returnByValue: true,
  });
  isDone = title.result.value === "DONE";
  if (isDone) break;
  await delay(250);
}

if (!isDone) {
  const pageState = await sendCommand(page.webSocketDebuggerUrl, "Runtime.evaluate", {
    expression: "`${document.title}\\n${document.body.innerText}`",
    returnByValue: true,
  });
  throw new Error(
    `Timed out waiting for the rendered video download:\n${pageState.result.value}`,
  );
}

const blobSizeResult = await sendCommand(page.webSocketDebuggerUrl, "Runtime.evaluate", {
  expression: "window.renderedBlob.size",
  returnByValue: true,
});
const blobSize = blobSizeResult.result.value;
const chunkSize = 512 * 1024;
writeFileSync(outputFile, Buffer.alloc(0));

for (let start = 0; start < blobSize; start += chunkSize) {
  const end = Math.min(start + chunkSize, blobSize);
  const encodedChunk = await sendCommand(page.webSocketDebuggerUrl, "Runtime.evaluate", {
    expression: `(async () => {
      const bytes = new Uint8Array(await window.renderedBlob.slice(${start}, ${end}).arrayBuffer());
      let binary = "";
      for (let offset = 0; offset < bytes.length; offset += 32768) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
      }
      return btoa(binary);
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  appendFileSync(outputFile, Buffer.from(encodedChunk.result.value, "base64"));
}

console.log(outputFile);

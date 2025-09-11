import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";

const name = "libp2wviewer";
const owner = "p2wviewer";
const repo = "libp2wviewer";

const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
console.log("Fetching latest release from", url);

const data = await fetch(url, {
  headers: { "User-Agent": "Sidecar Bot" }
}).then(res => res.json());

console.log("Latest release:", data.tag_name);

function getTarget() {
  const rustInfo = execSync("rustc -vV").toString();
  const match = /host:\s+(\S+)/.exec(rustInfo);
  if (!match) throw new Error("Failed to determine platform target triple");
  return match[1];
}

function getAssetName(target) {
  if (target.includes("windows")) return /windows_x86_64\.exe$/;
  if (target.includes("apple-darwin") && target.includes("aarch64")) return /apple-darwin_aarch64$/;
  if (target.includes("linux") && target.includes("x86_64")) return /linux_x86_64$/;
  return null;
}

const target = getTarget();
const assetPattern = getAssetName(target);
if (!assetPattern) throw new Error(`Unsupported target: ${target}`);

const asset = data.assets.find(a => assetPattern.test(a.name));
if (!asset) throw new Error(`No matching asset for target ${target}`);

const binaryTmpPath = path.join("src-tauri", "binaries", asset.name);
const extension = target.includes("windows") ? ".exe" : "";
const finalName = `${name}-${target}${extension}`;
const binaryFinalPath = path.join(binariesDir, finalName);
console.log("Downloading:", asset.browser_download_url);

await new Promise((resolve, reject) => {
  const file = fs.createWriteStream(binaryTmpPath);
  https.get(asset.browser_download_url, { headers: { "User-Agent": "Sidecar Bot" } }, response => {
    response.pipe(file);
    file.on("finish", () => file.close(resolve));
  }).on("error", err => {
    if (fs.existsSync(binaryTmpPath)) fs.unlinkSync(binaryTmpPath);
    reject(err);
  });
});

fs.renameSync(binaryTmpPath, binaryFinalPath);
console.log(`Placed binary at: ${binaryFinalPath}`);

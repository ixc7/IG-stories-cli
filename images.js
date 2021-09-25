import path from "path";
import { spawnSync } from "child_process";
import { __dirname } from "./utils.js";

function showMedia(url) {
  return spawnSync(path.resolve(__dirname, "timg"), [
    `-g ${process.stdout.columns}x${process.stdout.rows - 10}`,
    `--compress`,
    url,
  ]);
}

export { showMedia };

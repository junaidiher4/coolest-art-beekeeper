import * as fs from "node:fs";
import * as path from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryFile = path.join(process.cwd(), "entry.png");
const outFile = path.join(outDir, "entry.png");

const data = fs.readFileSync(entryFile);
if (data.length === 0) {
  throw new Error("entry.png is empty");
}
if (data.length > 1048576) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB limit`);
}
const isPng =
  data.length >= 8 &&
  data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
const isJpeg =
  data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither a PNG nor a JPEG image");
}
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, data);

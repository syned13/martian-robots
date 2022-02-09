import { execute } from "./handler/handler";

var fs = require("fs");

function getInputContent(): string[] {
  if (process.argv.length < 3) {
    throw new Error("input file not specified");
  }

  const fileName = process.argv[2];

  const file = fs.readFileSync(fileName);

  const fileStr = String(file);

  if (fileStr === "") {
    throw new Error("file is empty");
  }

  return fileStr.split("\n");
}

async function main() {
  try {
    const inputContent = getInputContent();
    await execute(inputContent);
  } catch (e) {
    console.log(e);
  }
}

main();

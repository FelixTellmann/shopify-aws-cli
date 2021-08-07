import { red } from "colorette";
import { initApp } from "src/app";

import { version } from "../package.json";

import { cleanup, nodeVersionWarning } from "./utils/utils";

const USAGE_DOCS = `Usage:
npm init shopify-app
`;

interface GoalAnswer {
  goal: string;
}

const run = async (): Promise<0 | void> => {
  const args = process.argv.slice(2);

  const help = args.indexOf("--help") >= 0 || args.indexOf("-h") >= 0;
  const info =
    args.indexOf("--info") >= 0 || args.indexOf("--version") >= 0 || args.indexOf("--v") >= 0;

  if (info) {
    console.log("create-shopify-starter-app:", version, "\n");
    return 0;
  }

  if (help) {
    console.log(USAGE_DOCS);
    return 0;
  }

  nodeVersionWarning();

  try {
    await initApp();
  } catch (e) {
    console.error(`\n${red("✖")} ${e.message}\n`);
  }

  cleanup();
};

(async () => {
  try {
    await run();
  } catch (e) {
    console.error(e);
  }
})();

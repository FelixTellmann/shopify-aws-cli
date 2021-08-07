import { writeFile, readFile } from "fs/promises";

import { bold, cyan } from "colorette";

import { Spinner } from "cli-spinner";

import { rimraf } from "./utils/utils";
import { downloadStarterMain } from "./utils/download";
import { unZipBuffer } from "./utils/unzip";
import { installDependencies } from "./utils/install";

interface Answers {
  folder: string;
  name: string;
}

export const initApp = async () => {
  const answers: Answers = await prompt();
  const name = answers.name;
  const folder = answers.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "")
    .replace(/^-/, "");

  await createApp({ name, folder });

  console.log("Coolio, Your presentation is initialized.\n");

  info({ name, folder });
};

const prompt = (): Promise<Answers> => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "What's your app name? (can not contain shopify)",
      default: "starter-app",
      validate: (input: string) => {
        const reservedKeywords: boolean = /shopify/gi.test(input);

        if (input && input.length > 0 && !reservedKeywords) {
          return true;
        } else {
          return "Please provide an app name";
        }
      },
    },
  ];

  console.log(`\nCool, let's kick start a new ${cyan("Shopify-AWS")} App\n`);

  const inquirer = require("inquirer");

  return inquirer.prompt(questions);
};

const info = ({ folder }: Answers) => {
  console.log(
    `\nRun ${cyan("yarn shopify")} in the newly created folder ${cyan(
      folder
    )} to serve your app locally at the address ${cyan("http://localhost:8081")}\n`
  );
};

const createApp = async (answers: Answers) => {
  await downloadInstallPresentation(answers);

  await installDependencies(answers.folder, "2/3");

  await updatePresentation(answers);
};

const downloadInstallPresentation = async (answers: Answers) => {
  const loading = new Spinner(bold("[1/3] Creating your presentation..."));
  loading.setSpinnerString(18);
  loading.start();

  // 1. Remove dir
  rimraf(answers.folder);

  // 2. Download starter
  const buffer = await downloadStarterMain();
  await unZipBuffer(buffer, answers.folder);

  loading.stop(true);
};

const updatePresentation = async (answers: Answers) => {
  const loading = new Spinner(bold("[3/3] Updating app settings..."));
  loading.setSpinnerString(18);
  loading.start();

  // 4. Replace values in starter
  await replaceAnswers(answers);

  loading.stop(true);
};

const replaceAnswers = async (answers: Answers) => {
  const replaceResources = [
    `${answers.folder}/src/index.html`,
    `${answers.folder}/src/manifest.json`,
    `${answers.folder}/webpack.config.js`,
  ];

  for (const filePath of replaceResources) {
    let data: string = (await readFile(filePath)).toString("utf8");

    data = data.replace(/{{DECKDECKGO_TITLE}}/g, answers.name);
    data = data.replace(
      /{{DECKDECKGO_SHORT_NAME}}/g,
      answers.name && answers.name.length > 12 ? answers.name.substr(0, 12) : answers.name
    );
    data = data.replace(/{{DECKDECKGO_DESCRIPTION}}/g, answers.name);
    data = data.replace(/{{DECKDECKGO_AUTHOR}}/g, answers.name);

    await writeFile(filePath, data);
  }
};

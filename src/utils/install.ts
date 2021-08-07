import { Spinner } from "cli-spinner";
import { bold } from "colorette";

import { cmd, npm, yarn } from "./utils";

export const installDependencies = async (folder: string, step: string) => {
  const loading = new Spinner(bold(`[${step}] Installing dependencies...`));
  loading.setSpinnerString(18);
  loading.start();

  // await npm("ci", folder);
  await yarn("install --frozen-lockfile", folder);

  loading.stop(true);
};

export const setShopifyApp = async (folder: string, step: string) => {
  const loading = new Spinner(bold(`[${step}] Installing dependencies...`));
  loading.setSpinnerString(18);
  loading.start();

  // await npm("ci", folder);
  await cmd("shopify node connect", folder);

  loading.stop(true);
};

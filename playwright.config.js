import { devices } from "@playwright/test";

const config = {
  testDir: "./test",
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        outputFolder: "./out/allure-results",
        environmentInfo: {
          node_version: process.version,
        },
      },
    ],
  ],
  outputDir: "test-results/",
};

export default config;

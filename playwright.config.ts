import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from "@playwright/test"

export function getWebServer() {
  const framework = process.env.FRAMEWORK || "vanilla"
  console.info(`Testing integration with ${framework}`)

  const frameworks = {
    preact: {
      command: "pnpm start-react",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },

    qwik: {
      command: "pnpm start-qwik",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },
    react: {
      command: "pnpm start-preact",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },
    solid: {
      command: "pnpm start-solid",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },
    svelte: {
      command: "pnpm start-svelte",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },
    vanilla: {
      command: "pnpm start-vanilla",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },
    vue: {
      command: "pnpm start-vue",
      url: "http://localhost:1312",
      reuseExistingServer: !process.env.CI,
    },
  }

  return frameworks[framework]
}

const webServer = getWebServer()

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  outputDir: "./e2e/results",
  testMatch: "*.e2e.ts",
  fullyParallel: !process.env.CI,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    process.env.CI
      ? ["github", ["junit", { outputFile: "e2e/junit.xml" }]]
      : ["list"],
    ["html", { outputFolder: "e2e/report", open: "never" }],
  ].filter(Boolean) as ReporterDescription[],
  retries: process.env.CI ? 2 : 0,
  webServer,
  use: {
    baseURL: webServer.url,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
    timezoneId: "GMT",
  },
  projects: [
    {
      name: "Google Chrome",
      use: {
        channel: "chrome",
      },
    },
  ],
}

export default config

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FRAMEWORK: string
    }
  }
}

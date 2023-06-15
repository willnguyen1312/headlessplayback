import { expect, test } from "@playwright/test"

test.describe("Headless playback application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should pass the smoke test", async ({ page }) => {
    await expect(page.getByText("Duration: 634.566")).toBeVisible()
    await expect(page.getByText("BitrateInfo: 180, 180, 270, 360, 360, 432, 576, 720, 1080, 2160")).toBeVisible()

    await page.getByText("Switch stream").click()
    await expect(page.getByText("Duration: 631.96")).toBeVisible()
    await expect(page.getByText("BitrateInfo: 288, 396, 504, 720, 1080")).toBeVisible()
  })
})

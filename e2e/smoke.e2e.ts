import { expect, test } from "@playwright/test"

test.describe("Headless playback application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should pass the smoke test", async ({ page }) => {
    await expect(page.getByText("Duration: 60")).toBeVisible()
    await expect(
      page.getByText("Levels: 144, 240, 360, 480, 576"),
    ).toBeVisible()

    await page.getByText("Switch stream").click()
    await expect(page.getByText("Duration: 71")).toBeVisible()
    await expect(
      page.getByText("Levels: 180, 270, 360, 540, 720, 1080"),
    ).toBeVisible()
  })
})

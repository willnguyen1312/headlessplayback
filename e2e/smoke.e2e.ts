import { expect, test } from "@playwright/test"
import { testid } from "./__utils"

test.describe("Application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app2")
  })
  test("should go to the correct route", async ({ page }) => {
    await expect(page.getByText("Duration: 60")).toBeVisible()
    await expect(page.getByText("Levels: 144, 240, 360, 480, 576")).toBeVisible()

    await page.getByText("Switch stream").click()
    await expect(page.getByText("Duration: 70.93696")).toBeVisible()
    await expect(page.getByText("Levels: 180, 270, 360, 540, 720, 1080")).toBeVisible()
  })
})

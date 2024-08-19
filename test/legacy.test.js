import { test, expect } from "@playwright/test";
import { firefox, chromium } from "playwright";
import { parameter } from "allure-js-commons";
import 'dotenv/config';

const auth_data = [
  [process.env.LOGIN, process.env.TOKEN]
]

for (const [login, token] of auth_data) {
  test("cookie login", async() => {
    await parameter("login", login, { mode: "masked" });
    await parameter("token", token, { mode: "masked" });
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await browser.newPage();
    const user_cookie = {
      name: "centralauth_User",
      value: login,
      domain: "https://en.wikipedia.org/",
      path: "/",
      secure: true
    }
    const token_cookie = {
      name: "centralauth_Token",
      value: token,
      domain: "https://en.wikipedia.org/",
      path: "/",
      secure: true
    }
    await context.addCookies([user_cookie, token_cookie]);

    await page.goto("https://en.wikipedia.org/");

    await isLoggedIn(page);  
  });
};

async function isLoggedIn(page) {
  const userDropdown = await page.locator('#vector-user-links-dropdown-checkbox');
  await expect(userDropdown).toBeVisible();
};

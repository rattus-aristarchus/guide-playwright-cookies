import { test, expect } from "@playwright/test";
import { firefox, chromium } from "playwright";
import { parameter, step } from "allure-js-commons";
import 'dotenv/config';

const auth_data = [
  [process.env.LOGIN, process.env.TOKEN, "https://en.wikipedia.org/"]
]

for (const [login, token, URL] of auth_data) {
  test("Log in to wikipedia using cookies", async() => {
    await parameter("login", login, { mode: "masked" });
    await parameter("token", token, { mode: "masked" });
    await parameter("URL", URL);
    var context;
    var page;
    await step("Create the page object", async (s1) => {
      const browser = await chromium.launch();
      context = await browser.newContext();
      page = await browser.newPage();
    });
    await step("Add cookies", async (s1) => {
      const user_cookie = {
        name: "centralauth_User",
        value: login,
        domain: URL,
        path: "/"
      };
      const token_cookie = {
        name: "centralauth_Token",
        value: token,
        domain: URL,
        path: "/"
      };
      await context.addCookies([user_cookie, token_cookie]);
    });

    await step("Go to " + URL, async (s1) => {
      await page.goto(URL);      
    });

    await step("Check that the user is logged in", async (s1) => {
      await isLoggedIn(page);        
    });
  });
};



async function isLoggedIn(page) {
  const userDropdown = await page.locator('#vector-user-links-dropdown-checkbox');
  await expect(userDropdown).toBeVisible();
};

import { test, expect } from "@playwright/test";
import { firefox, chromium } from "playwright";
import 'dotenv/config';

test("cookie login", async() => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await browser.newPage();
  const user_cookie = {
    name: "centralauth_User",
    value: process.env.LOGIN,
    domain: "https://en.wikipedia.org/",
    path: "/",
    secure: true
  }
  const token_cookie = {
    name: "centralauth_Token",
    value: process.env.TOKEN,
    domain: "https://en.wikipedia.org/",
    path: "/",
    secure: true
  }
  await context.addCookies([user_cookie, token_cookie]);

  await page.goto("https://en.wikipedia.org/");
  
  await isLoggedIn(page);  
});

async function isLoggedIn(page) {
  const userDropdown = await page.locator('#vector-user-links-dropdown-checkbox');
  await expect(userDropdown).toBeVisible();
};

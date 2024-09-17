import { test, expect } from "@playwright/test";
import { firefox, chromium } from "playwright";
import 'dotenv/config';

const auth_data = [
  [process.env.LOGIN, process.env.PASSWORD, "www.saucedemo.com"]
]

for (const [login, password, domain] of auth_data) {
  test("Log in to wikipedia using cookies", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await browser.newPage();
    
    const user_cookie = {
      name: "session-username",
      value: login,
      domain: domain,
      path: "/"
    };
    const token_cookie = {
      name: "session-password",
      value: password,
      domain: domain,
      path: "/"
    };
    await context.addCookies([user_cookie, token_cookie]);
    
    await page.goto("https://" + domain);      
    
    await isLoggedIn(page);        
  });
};

async function isLoggedIn(page) {
  await expect(page.url()).toBe("https://www.saucedemo.com/inventory.html");
};

import { test, expect } from "@playwright/test";
import { firefox, chromium } from "playwright";
import 'dotenv/config';

const auth_data = [
  [process.env.LOGIN, process.env.TOKEN, "en.wikipedia.org/"]
]

for (const [login, token, domain] of auth_data) {
  test("Log in to wikipedia using cookies", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await browser.newPage();
    
    const user_cookie = {
      name: "centralauth_User",
      value: login,
      domain: domain,
      path: "/"
    };
    const token_cookie = {
      name: "centralauth_Token",
      value: token,
      domain: domain,
      path: "/"
    };
    await context.addCookies([user_cookie, token_cookie]);
    
    await page.goto("https://" + domain);      
    
    await isLoggedIn(page);        
  });
};

async function isLoggedIn(page) {
  const userWatchlist = await page.locator('#pt-watchlist-2');
  await expect(userWatchlist).toBeVisible();
};

test("Cookie is generated", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0"
    });
    const page = await browser.newPage();

    await page.goto("https://en.wikipedia.org", { waitUntil: 'networkidle' });
 
    const cookies = await context.cookies();
    console.log("Got " + cookies.length + " cookies: " + cookies);
    const session_cookies = cookies.filter((cookie) => {
        return cookie.name == "centralauth_Session";
    });   
    await expect(session_cookies.length).toBe(1); 
});

async function logIn(context, page) {
    const user_cookie = {
        name: "centralauth_User",
        value: process.env.LOGIN,
        domain: "en.wikipedia.org",
        path: "/"
    };
    const token_cookie = {
        name: "centralauth_Token",
        value: process.env.TOKEN,
        domain: "en.wikipedia.org",
        path: "/"
    };
    await context.addCookies([user_cookie, token_cookie]);
    
    await page.goto("https://en.wikipedia.org");      
};

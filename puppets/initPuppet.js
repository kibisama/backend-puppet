const puppeteer = require("puppeteer");
const chalk = require("chalk");
const extendPage = require("./extendPage");

/**
 * Initialize a puppet.
 * @param {string} name
 * @param {string} color
 * @param {string} url
 * @param {PuppeteerLaunchOptions} browserOptions
 * @param {WaitForOptions} waitForOptions
 * @returns {Promise<{Promise<Browser>,Promise<Page>}>}
 */
const initPuppet = async (
  name = "Puppeteer",
  color = "white",
  url = "",
  waitForOptions = {
    timeout: 300000,
    waitUntil: "networkidle0",
  },
  browserOptions = {
    headless: false,
    defaultViewport: null,
  }
) => {
  console.log(`${chalk[color](name + ":")} Initializing Puppeteer ...`);
  try {
    const browser = await puppeteer.launch(browserOptions);
    const context = await browser.createBrowserContext();
    context.on("targetcreated", async (target) => {
      if (target.type() === "page") {
        const page = await target.page();
        extendPage(page, name, color);
      }
    });
    const page = await context.newPage();
    if (url) {
      await page.goto(url, waitForOptions);
      await page.waitForPageRendering();
    }
    return { browser, context, page };
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
  }
};

module.exports = initPuppet;

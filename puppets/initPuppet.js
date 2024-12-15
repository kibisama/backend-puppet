const puppeteer = require("puppeteer");
const chalk = require("chalk");
const extendPage = require("./extendPage");

/**
 * Initialize a puppet.
 * @param {object} options
 * @returns {Promise<object|undefined>}
 */
module.exports = async (options = {}) => {
  const name = options.name ?? "Puppeteer";
  const color = options.color ?? "white";
  const browserOptions = options.browserOptions ?? {
    headless: false,
    defaultViewport: null,
  };
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
    return { browser, context, page };
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
  }
};

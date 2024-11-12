const chalk = require("chalk");
const initPuppet = require("../initPuppet");
const xPaths = require("./xPaths");
const functions = require("./functions");

const cardinalPuppet = async () => {
  const name = "CARDINAL";
  const color = "red";
  const url = process.env.CARDINAL_ADDRESS;
  const waitForOptions = {
    timeout: 300000,
    waitUntil: "networkidle0",
  };
  const fn = functions(name, color, waitForOptions, xPaths);
  try {
    const { browser, context, page } = await initPuppet(
      name,
      color,
      url,
      waitForOptions
    );
    const usernameInput = await page.waitForSelector(
      'input[id="okta-signin-username"]'
    );
    if (usernameInput) {
      const connect = await fn.signIn(page);
      if (connect instanceof Error) {
        return connect;
      }
    }
    return { name, color, browser, context, page, fn, waitForOptions };
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
  }
};

module.exports = cardinalPuppet;

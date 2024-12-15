const chalk = require("chalk");
const initPuppet = require("../initPuppet");
const xPaths = require("./xPaths");
const functions = require("./functions");

/**
 * Initialize a Cardinal puppet.
 * @param {object} options
 * @returns {Promise<object|undefined>}
 */
module.exports = async (options = {}) => {
  const name = options.name ?? "CARDINAL";
  const color = options.color ?? "red";
  const waitForOptions = options.waitForOptions ?? {
    timeout: 300000,
    waitUntil: "networkidle0",
  };
  const url = process.env.CARDINAL_ADDRESS;
  const fn = functions(name, color, waitForOptions);
  try {
    const { browser, context, page } = await initPuppet({
      name,
      color,
    });
    await fn.goto(page, url);
    const usernameInput = await page.waitForElement(
      xPaths.loginPage.usernameInput
    );
    if (usernameInput) {
      const login = await fn.signIn(page);
      if (login instanceof Error) {
        console.log(`${chalk[color](name + ":")} ${login.message}`);
      }
    }
    return { name, color, browser, context, page, fn };
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
  }
};

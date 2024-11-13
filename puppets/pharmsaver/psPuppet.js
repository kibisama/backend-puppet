const chalk = require("chalk");
const initPuppet = require("../initPuppet");
const xPaths = require("./xPaths");
const functions = require("./functions");
const PSPuppetError = require("./PSPuppetError");

const psPuppet = async () => {
  const name = "PHARMSAVER";
  const color = "blue";
  const url = process.env.PHARMSAVER_ADDRESS;
  const waitForOptions = {
    timeout: 300000,
    waitUntil: "networkidle2",
  };
  const fn = functions(name, color, waitForOptions, xPaths);
  try {
    const { browser, context, page } = await initPuppet(
      name,
      color,
      url,
      waitForOptions
    );
    const usernameInput = await page.waitForElement(
      xPaths.loginPage.usernameInput
    );
    if (usernameInput) {
      const login = await fn.signIn(page);
      if (login instanceof Error) {
        console.log(`${chalk[color](name + ":")} ${login.message}`);
        return;
      }
      return {
        name,
        color,
        browser,
        context,
        page,
        waitForOptions,
        xPaths,
        fn,
        PSPuppetError,
      };
    }
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
  }
};

module.exports = psPuppet;

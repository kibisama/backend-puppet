const chalk = require("chalk");
const dayjs = require("dayjs");

const reload = async (req, res, next) => {
  if (req.app.get("cardinalPuppetOccupied")) {
    const error = new Error("Puppet already occupied");
    error.status = 503;
    next(error);
  }
  const cardinalPuppet = req.app.get("cardinalPuppet");
  if (cardinalPuppet) {
    const { name, color, browser, context, page, fn, waitForOptions } =
      cardinalPuppet;
    try {
      req.app.set("cardinalPuppetOccupied", true);

      const id = process.env.CARDINAL_USERNAME;
      const password = process.env.CARDINAL_PASSWORD;
      const url = process.env.CARDINAL_ADDRESS;
      const navigationPromise = page.waitForNavigation(waitForOptions);
      await page.goto(url);
      await navigationPromise;
      await page.waitForPageRendering();
      const usernameInput = await page.$('input[id="okta-signin-username"]');
      if (usernameInput) {
        const connect = await fn.signIn(page, id, password);
        if (connect instanceof Error) {
          next(connect);
        }
      } // else if () {} find an element if Cardinal is under maintenance and send special error status
      next();
    } catch (e) {
      // console.log(`${chalk[color](name + ":")} ${e.message}`);
      next(e);
    }
  } else {
    // Reboot CardinalPuppet
  }
};
module.exports = reload;

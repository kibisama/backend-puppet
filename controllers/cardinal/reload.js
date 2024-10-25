const chalk = require("chalk");

const reload = async (req, res, next) => {
  if (req.app.get("cardinalPuppetOccupied")) {
    next(new Error("Puppet already occupied"));
  }
  const cardinalPuppet = req.app.get("cardinalPuppet");
  if (cardinalPuppet) {
    try {
      req.app.set("cardinalPuppetOccupied", true);
      const { name, color, browser, context, page, fn, waitForOptions } =
        cardinalPuppet;
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
      } // else if () {} find an element if Cardinal is under maintenance
      next();
    } catch (e) {
      console.log(`${chalk[color](name + ":")} ${e.message}`);
      next(e);
    }
  } else {
    next(new Error("Puppet not initiated"));
  }
};
module.exports = reload;

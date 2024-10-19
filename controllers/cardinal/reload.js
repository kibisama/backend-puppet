const chalk = require("chalk");

const reload = async (req, res, next) => {
  if (req.app.get("cardinalPuppetOccupied")) {
    next(new Error("Puppet is already occupied"));
  }
  req.app.set("cardinalPuppetOccupied", true);
  const { name, color, browser, context, page, fn, waitForOptions } =
    req.app.get("cardinalPuppet");
  const id = process.env.CARDINAL_USERNAME;
  const password = process.env.CARDINAL_PASSWORD;
  const url = process.env.CARDINAL_ADDRESS;
  try {
    await page.goto(url, waitForOptions);
    await page.waitForPageRendering();
    const usernameInput = await page.$('input[id="okta-signin-username"]');
    if (usernameInput) {
      const connect = await fn.signIn(page, id, password);
      if (connect instanceof Error) {
        next(connect);
      }
    } // else if () {} find an element if Cardinal is under maintenance
    else {
      next();
    }
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
    next(e);
  }
};
module.exports = reload;

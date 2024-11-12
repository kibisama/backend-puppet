const chalk = require("chalk");
const dayjs = require("dayjs");

const reload = async (req, res, next) => {
  const psPuppet = req.app.get("psPuppet");
  if (psPuppet) {
    const {
      name,
      color,
      browser,
      context,
      page,
      fn,
      xPaths,
      waitForOptions,
      PSPuppetError,
    } = psPuppet;
    try {
      if (req.app.get("psPuppetOccupied")) {
        const error = new PSPuppetError("PSPuppet already in use");
        error.status = 503;
        next(error);
      } else {
        req.app.set("psPuppetOccupied", true);
        console.log(
          `${chalk[color](name + ":")} ${dayjs().format(
            "MM/DD/YY HH:mm:ss"
          )} Reloading PharmSaver Order Page ...`
        );
        const OrderPageUrl = process.env.PHARMSAVER_ADDRESS;
        const goToOrderPage = async () => {
          const navigationPromise = page.waitForNavigation(waitForOptions);
          await page.goto(OrderPageUrl);
          await navigationPromise;
          await page.waitForPageRendering();
          await page.waitForElementFade(xPaths.modal.blockUI);
        };
        await goToOrderPage();
        const url = page.url();
        if (url === OrderPageUrl) {
          next("route");
        } else {
          const usernameInput = await page.waitForElement(
            xPaths.loginPage.usernameInput
          );
          if (usernameInput) {
            const login = await fn.signIn(page);
            if (login instanceof Error) {
              const error = new PSPuppetError(login.message);
              return next(error);
            }
            await goToOrderPage();
            next("route");
          } else {
            const error = new PSPuppetError(
              "Failed to reload PharmSaver Order Page"
            );
            return next(error);
          }
        }
        console.log(
          `${chalk[color](name + ":")} ${dayjs().format(
            "MM/DD/YY HH:mm:ss"
          )} ... PharmSaver Order Page reloaded`
        );
      }
    } catch (e) {
      const error = new PSPuppetError(e.message);
      next(error);
    }
  } else {
    // Reboot PsPuppet
  }
};
module.exports = reload;

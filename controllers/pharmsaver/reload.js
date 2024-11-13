const chalk = require("chalk");
const dayjs = require("dayjs");
const xPaths = require("../../puppets/pharmsaver/xPaths");
const PSPuppetError = require("../../puppets/pharmsaver/PSPuppetError");

const reload = async (req, res, next) => {
  const psPuppet = req.app.get("psPuppet");
  if (psPuppet) {
    const { name, color, browser, context, page, fn, waitForOptions } =
      psPuppet;
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
          await page.waitForElementFade(xPaths.modal.blockUI);
        };
        const onReloaded = () => {
          console.log(
            `${chalk[color](name + ":")} ${dayjs().format(
              "MM/DD/YY HH:mm:ss"
            )} ... PharmSaver Order Page reloaded`
          );
          next("route");
        };
        await goToOrderPage();
        const url = page.url();
        if (url === OrderPageUrl) {
          onReloaded();
        } else {
          const usernameInput = await page.waitForElement(
            xPaths.loginPage.usernameInput
          );
          if (usernameInput) {
            const login = await fn.signIn(page);
            if (login instanceof PSPuppetError) {
              return next(login);
            }
            await goToOrderPage();
            onReloaded();
          } else {
            const error = new PSPuppetError(
              "Failed to reload PharmSaver Order Page"
            );
            next(error);
          }
        }
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

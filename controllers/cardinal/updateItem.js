const chalk = require("chalk");

const updateItem = async (req, res, next) => {
  const { name, color, browser, context, page, fn, waitForOptions } =
    req.app.get("cardinalPuppet");
  const { ndc11 } = req.body;
  console.log(
    `${chalk[color](name + ":")} Requested to update item info ${ndc11} ...`
  );
  try {
    await fn.inputHomeSearchBar(page, ndc11);
    const noResult = await page.waitForElement(
      `//span[contains(text(), "We're sorry. We weren't able to find")]`,
      500
    );
    if (noResult) {
      return res.sendStatus(404);
    }
    const productLink = await page.waitForElement(
      `//span[contains(text(), "${ndc11}")] /.. //a`
    );
    let productDetails;
    if (productLink) {
      await Promise.all([page.waitForNavigation(), productLink.click()]);
      await page.waitForPageRendering();

      let count = 0;
      const maxCount = 1;
      while (count++ < maxCount) {
        const result = await fn.collectProductDetails(page);
        if (result instanceof Error) {
          const url = page.url();
          Promise.all(page.waitForNavigation(), page.goto(url));
          await page.waitForPageRendering();
          productDetails = result;
        } else {
          productDetails = result;
          break;
        }
      }
    } else {
      next(new Error("Failed to find Product Details page."));
    }
    if (!productDetails || productDetails instanceof Error) {
      return next(productDetails);
    }

    req.app.set("cardinalPuppetOccupied", false);
    return res.send({
      results: { productDetails },
    });
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
    next(e);
  }
};

module.exports = updateItem;

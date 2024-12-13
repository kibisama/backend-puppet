const chalk = require("chalk");
const dayjs = require("dayjs");
const CardinalPuppetError = require("../../puppets/cardinal/CardinalPuppetError");

module.exports = async (req, res, next) => {
  try {
    const { puppetIndex } = res.locals;
    const { name, color, page, fn } =
      req.app.get("cardinalPuppets")[puppetIndex];
    let { cin, query } = req.body;
    console.log(
      `${chalk[color](name + ":")} ${dayjs().format(
        "MM/DD/YY HH:mm:ss"
      )} Retrieving product details for "${cin ?? query}" ...`
    );
    if (query) {
      const result = await fn.search(page, query);
      if (typeof result === "string") {
        cin = result;
      } else if (!result) {
        const error = new CardinalPuppetError(
          `No results found for "${query}"`
        );
        error.status = 404;
        return next(error);
      } else if (result instanceof CardinalPuppetError) {
        return next(result);
      }
    }
    const url = `https://vantus.cardinalhealth.com/product/${cin}?tab=more-details`;
    await fn.goto(page, url);
    const result = await fn.getProductDetails(page);
    res.send(result);
    next("route");
  } catch (e) {
    const error = new CardinalPuppetError(e.message);
    next(error);
  }
  // console.log(
  //   `${chalk[color](name + ":")} Requested to update item info ${ndc11} ...`
  // );
  // try {
  //   await fn.inputHomeSearchBar(page, ndc11);
  //   const noResult = await page.waitForElement(
  //     `//span[contains(text(), "We're sorry. We weren't able to find")]`,
  //     500
  //   );
  //   if (noResult) {
  //     return res.sendStatus(404);
  //   }
  //   const productLink = await page.waitForElement(
  //     `//span[contains(text(), "${ndc11}")] /.. //a`
  //   );
  //   let productDetails;
  //   if (productLink) {
  //     await Promise.all([page.waitForNavigation(), productLink.click()]);
  //     await page.waitForPageRendering();

  //     let count = 0;
  //     const maxCount = 1;
  //     while (count++ < maxCount) {
  //       const result = await fn.collectProductDetails(page);
  //       if (result instanceof Error) {
  //         const url = page.url();
  //         Promise.all(page.waitForNavigation(), page.goto(url));
  //         await page.waitForPageRendering();
  //         productDetails = result;
  //       } else {
  //         productDetails = result;
  //         break;
  //       }
  //     }
  //   } else {
  //     next(new Error("Failed to find Product Details page."));
  //   }
  //   if (!productDetails || productDetails instanceof Error) {
  //     return next(productDetails);
  //   }

  //   req.app.set("cardinalPuppetOccupied", false);
  //   return res.send({
  //     results: { productDetails },
  //   });
  // } catch (e) {
  //   console.log(`${chalk[color](name + ":")} ${e.message}`);
  //   next(e);
  // }
};

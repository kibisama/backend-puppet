const chalk = require("chalk");
const dayjs = require("dayjs");

const updateSearch = async (req, res, next) => {
  const { name, color, page, fn, xPaths, PSPuppetError } =
    req.app.get("psPuppet");
  try {
    const { ndc11 } = req.body;
    console.log(
      `${chalk[color](name + ":")} ${dayjs().format(
        "MM/DD/YY HH:mm:ss"
      )} Requested to update Search Results ${ndc11} ...`
    );
    const ndc = ndc11.replaceAll("-", "");
    const search = await fn.search(page, ndc);
    if (search instanceof Error) {
      const error = new PSPuppetError(search.message);
      return next(error);
    }
    const noResult = await page.waitForElement(
      xPaths.orderPage.inlineOopsImg,
      500
    );
    if (noResult) {
      const error = new PSPuppetError("No search result found");
      error.status = 404;
      return next(error);
    }
    const results = await fn.collectSearchResults(page);
    if (results instanceof Error) {
      const error = new PSPuppetError(results.message);
      return next(error);
    }
    req.app.set("psPuppetOccupied", false);
    return res.send({
      results,
    });
  } catch (e) {
    const error = new PSPuppetError(e.message);
    next(error);
  }
};

module.exports = updateSearch;

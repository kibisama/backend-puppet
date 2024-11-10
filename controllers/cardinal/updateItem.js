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
    const result = await page.waitForElement(
      `//span[contains(text(), "${ndc11}")] /.. //a`
    );
    // 상세 페이지 접근 전에 가장 낮은 netuoicost 상품을 저장하자.
    if (result) {
      await Promise.all([page.waitForNavigation(), result.click()]);
      await page.waitForPageRendering();
      await fn.collectProductDetails(page);
    }

    req.app.set("cardinalPuppetOccupied", false);
    return res.send({
      results: {},
    });
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
    next(e);
  }
};

module.exports = updateItem;

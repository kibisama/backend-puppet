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
    if (result instanceof CardinalPuppetError) {
      return next(result);
    }
    res.send({ result });
    next("route");
  } catch (e) {
    const error = new CardinalPuppetError(e.message);
    next(error);
  }
};

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

const chalk = require("chalk");
const dayjs = require("dayjs");
const PSPuppetError = require("../../puppets/pharmsaver/PSPuppetError");

module.exports = async (req, res, next) => {
  try {
    const { puppetIndex } = res.locals;
    const { name, color, page, fn } = req.app.get("psPuppets")[puppetIndex];
    const { ndc11 } = req.body;
    console.log(
      `${chalk[color](name + ":")} ${dayjs().format(
        "MM/DD/YY HH:mm:ss"
      )} Retrieving search results for "${ndc11}" ...`
    );
    const search = await fn.search(page, ndc11);
    if (search instanceof PSPuppetError) {
      return next(search);
    } else if (!search) {
      const error = new PSPuppetError("No search result found");
      error.status = 404;
      return next(error);
    } else {
      const results = await fn.collectSearchResults(page);
      if (results instanceof PSPuppetError) {
        return next(results);
      }
      console.log(
        `${chalk[color](name + ":")} ${dayjs().format(
          "MM/DD/YY HH:mm:ss"
        )} Data collection completed. Sending response ...`
      );
      res.send({
        results,
      });
      next("route");
    }
  } catch (e) {
    const error = new PSPuppetError(e.message);
    next(error);
  }
};

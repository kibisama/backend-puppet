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
      const error = new PSPuppetError(`No results found for "${ndc11}"`);
      error.status = 404;
      return next(error);
    } else {
      const results = await fn.getSearchResults(page);
      if (results instanceof PSPuppetError) {
        return next(results);
      }
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

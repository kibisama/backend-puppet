const chalk = require("chalk");
const dayjs = require("dayjs");
const PSPuppetError = require("../../puppets/pharmsaver/PSPuppetError");

const updateSearch = async (req, res, next) => {
  const { name, color, page, fn } = req.app.get("psPuppet");
  try {
    const { ndc11 } = req.body;
    console.log(
      `${chalk[color](name + ":")} ${dayjs().format(
        "MM/DD/YY HH:mm:ss"
      )} Requested to update Search Results ${ndc11} ...`
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
        )} Data collection completed. Responding ...`
      );
      req.app.set("psPuppetOccupied", false);
      return res.send({
        results,
      });
    }
  } catch (e) {
    const error = new PSPuppetError(e.message);
    next(error);
  }
};

module.exports = updateSearch;

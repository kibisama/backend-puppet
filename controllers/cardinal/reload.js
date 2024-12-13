const CardinalPuppetError = require("../../puppets/cardinal/CardinalPuppetError");

module.exports = async (req, res, next) => {
  try {
    /* Choosing a free puppet */
    const cardinalPuppetsOccupied = req.app.get("cardinalPuppetsOccupied");
    const cardinalPuppets = req.app.get("cardinalPuppets");
    let cardinalPuppet = null;
    for (let i = 0; i < cardinalPuppetsOccupied.length; i++) {
      if (!cardinalPuppetsOccupied[i]) {
        cardinalPuppetsOccupied[i] = true;
        cardinalPuppet = cardinalPuppets[i];
        res.locals.puppetIndex = i;
        break;
      }
    }
    if (!cardinalPuppet) {
      const error = new CardinalPuppetError("All Cardinal puppets are busy");
      error.status = 503;
      return next(error);
    }
    const { page, fn } = cardinalPuppet;
    /* Reloading the page */
    const reload = await fn.reload(page);
    if (reload instanceof CardinalPuppetError) {
      return next(reload);
    }
    next("route");
  } catch (e) {
    const error = new CardinalPuppetError(e.message);
    next(error);
  }
};

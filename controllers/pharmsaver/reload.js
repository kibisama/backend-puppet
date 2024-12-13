const PSPuppetError = require("../../puppets/pharmsaver/PSPuppetError");

module.exports = async (req, res, next) => {
  try {
    /* Choosing a free puppet */
    const psPuppetsOccupied = req.app.get("psPuppetsOccupied");
    const psPuppets = req.app.get("psPuppets");
    let psPuppet = null;
    for (let i = 0; i < psPuppetsOccupied.length; i++) {
      if (!psPuppetsOccupied[i]) {
        psPuppetsOccupied[i] = true;
        psPuppet = psPuppets[i];
        res.locals.puppetIndex = i;
        break;
      }
    }
    if (!psPuppet) {
      const error = new PSPuppetError("All Pharmsaver puppets are busy");
      error.status = 503;
      return next(error);
    }
    const { page, fn } = psPuppet;
    /* Reloading the page */
    const reload = await fn.reload(page);
    if (reload instanceof PSPuppetError) {
      return next(reload);
    }
    next("route");
  } catch (e) {
    const error = new PSPuppetError(e.message);
    next(error);
  }
};

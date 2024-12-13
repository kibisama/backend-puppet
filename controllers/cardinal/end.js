module.exports = (req, res) => {
  const { puppetIndex } = res.locals;
  const cardinalPuppetsOccupied = req.app.get("cardinalPuppetsOccupied");
  cardinalPuppetsOccupied[puppetIndex] = false;
};

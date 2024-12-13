module.exports = (req, res) => {
  const { puppetIndex } = res.locals;
  const psPuppetsOccupied = req.app.get("psPuppetsOccupied");
  psPuppetsOccupied[puppetIndex] = false;
};

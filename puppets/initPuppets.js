const cardinalPuppet = require("./cardinal/cardinalPuppet");
const psPuppet = require("./pharmsaver/psPuppet");
module.exports = async (app) => {
  const puppets = await Promise.all([
    cardinalPuppet("CARDINAL_1", "red"),
    // cardinalPuppet("CARDINAL_2", "magenta"),
    psPuppet(),
  ]);
  app.set("cardinalPuppets", [puppets[0]]);
  app.set("cardinalPuppetsOccupied", [false, false]);
  app.set("psPuppets", [puppets[1]]);
  app.set("psPuppetsOccupied", [false]);
};

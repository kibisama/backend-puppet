const cardinalPuppet = require("./cardinal/cardinalPuppet");
const psPuppet = require("./pharmsaver/psPuppet");
module.exports = async (app) => {
  const puppets = await Promise.all([
    cardinalPuppet({ name: "CARDINAL_1", color: "red" }),
    // cardinalPuppet({ name: "CARDINAL_2", color: "magenta" }),
    psPuppet(),
  ]);
  app.set("cardinalPuppets", [puppets[0]]);
  app.set("cardinalPuppetsOccupied", [false, false]);
  app.set("psPuppets", [puppets[1]]);
  app.set("psPuppetsOccupied", [false]);
};

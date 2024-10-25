module.exports = class CardinalPuppetError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardinalPuppetError";
  }
};

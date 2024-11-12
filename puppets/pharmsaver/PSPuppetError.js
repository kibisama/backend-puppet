module.exports = class PSPuppetError extends Error {
  constructor(message) {
    super(message);
    this.name = "PSPuppetError";
  }
};

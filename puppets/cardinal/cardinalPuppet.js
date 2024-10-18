const chalk = require("chalk");
const initPuppet = require("../initPuppet");
const xPaths = require("./xPaths");
const functions = require("./functions");

const cardinalPuppet = async () => {
  const name = "CARDINAL";
  const color = "red";
  const url = process.env.CARDINAL_ADDRESS;
  const waitForOptions = {
    timeout: 300000,
    waitUntil: "networkidle0",
  };
  const id = process.env.CARDINAL_USERNAME;
  const password = process.env.CARDINAL_PASSWORD;
  const fn = functions(name, color, xPaths);
  try {
    const { browser, context, page } = await initPuppet(
      name,
      color,
      url,
      waitForOptions
    );
    const connect = await fn.signIn(page, id, password);
    if (connect instanceof Error) {
      return connect;
    }
    return { name, color, browser, context, page, fn, waitForOptions };
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
  }
};

module.exports = cardinalPuppet;

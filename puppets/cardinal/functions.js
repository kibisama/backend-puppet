const chalk = require("chalk");
const xPaths = require("./xPaths");
const CardinalPuppetError = require("./CardinalPuppetError");
// const dayjs = require("dayjs");

const fn = (name, color, waitForOptions) => {
  return {
    /**
     * @param {Page} page
     * @param {string} url
     * @returns {Promise<undefined>}
     */
    async goto(page, url) {
      try {
        const naviPromise = page.waitForNavigation(waitForOptions);
        await page.goto(url);
        await naviPromise;
        await page.waitForPageRendering();
      } catch (e) {
        throw e;
      }
    },
    /**
     * @param {Page} page
     * @returns {Promise<undefined|CardinalPuppetError>}
     */
    async signIn(page) {
      console.log(`${chalk[color](name + ":")} Signing in to Vantus HQ ...`);
      try {
        const id = process.env.CARDINAL_USERNAME;
        const password = process.env.CARDINAL_PASSWORD;
        const _xPaths = xPaths.loginPage;
        const inputEls = await page.waitForElements([
          _xPaths.usernameInput,
          _xPaths.passwordInput,
          _xPaths.loginButton,
        ]);
        await inputEls[0].type(id);
        await inputEls[1].type(password);
        const naviPromise = page.waitForNavigation();
        await inputEls[2].click();
        await naviPromise;
        await page.waitForPageRendering({ minWaitingTime: 15000 });
        /* Handle redirection pages */
        const currentUrl = page.url();
        if (currentUrl === "https://vantus.cardinalhealth.com/home") {
          console.log(`${chalk[color](name + ":")} Signed in to Vantus HQ.`);
          return;
        }
        return new CardinalPuppetError("Failed to sign in to Vantus HQ.");
      } catch (e) {
        return new CardinalPuppetError(e.message);
      }
    },
    /**
     * @param {Page} page
     * @returns {Promise<undefined|CardinalPuppetError>}
     */
    async reload(page) {
      console.log(`${chalk[color](name + ":")} Reloading Vantus HQ ...`);
      try {
        let reloaded = false;
        const url = process.env.CARDINAL_ADDRESS;
        await this.goto(page, url);
        /* Handle redirection pages */
        const currentUrl = page.url();
        if (currentUrl === "https://vantus.cardinalhealth.com/home") {
          reloaded = true;
        } else {
          if (
            currentUrl.startsWith("https://pdlogin.cardinalhealth.com/signin")
          ) {
            const login = await this.signIn(page);
            if (login instanceof CardinalPuppetError) {
              return login;
            } else {
              reloaded = true;
            }
          }
        }
        if (reloaded) {
          console.log(`${chalk[color](name + ":")} Vantus HQ reloaded.`);
        } else {
          return new CardinalPuppetError("Failed to reload Vantus HQ.");
        }
      } catch (e) {
        return new CardinalPuppetError(e.message);
      }
    },
    /**
     * Returns the first CIN string listed from the search result table.
     * @param {Page} page
     * @param {string} query
     * @returns {Promise<string|null|CardinalPuppetError>}
     */
    async search(page, query) {
      console.log(
        `${chalk[color](name + ":")} Searching Vantus HQ for "${query}" ...`
      );
      try {
        const url = `https://vantus.cardinalhealth.com/search?q=${query}`;
        await this.goto(page, url);
        const _xPaths = xPaths.search;
        const resultPromises = [
          page.waitForElement(_xPaths.cin_),
          page.waitForElement(_xPaths.noResults),
        ];
        const i = await Promise.any(
          resultPromises.map((p, i) => p.then(() => i))
        );
        if (i === 0) {
          const result = await page.getInnerTexts(_xPaths.cin_);
          if (result[0]) {
            return result[0];
          }
        } else {
          const result = await page.getInnerTexts(_xPaths.noResults);
          if (result[0]) {
            return null;
          }
        }
        return new CardinalPuppetError(
          `Failed to find search results for "${query}".`
        );
      } catch (e) {
        return new CardinalPuppetError(e.message);
      }
    },
    /**
     * @param {Page} page
     * @returns {Promise<object|CardinalPuppetError>}
     */
    async getProductDetails(page) {
      console.log(`${chalk[color](name + ":")} Scraping product details ...`);
      try {
        const _xPaths = xPaths.product;
        const results = await page.getBatchData(_xPaths.info);
        const imgEl = await page.waitForElement(_xPaths.img);
        if (results && results.length > 0 && imgEl) {
          const result = results[0];
          result.img = String(
            await (await imgEl.getProperty("src")).jsonValue()
          ).trim();
          const contract = await page.getInnerTexts(_xPaths.contract);
          if (contract[0]) {
            result.contract = contract[0];
          }
          if (result.stockStatus !== "INELIGIBLE") {
            result.stock = (await page.getInnerTexts(_xPaths.stock))[0];
          }
          const extraInfoKeys = Object.keys(_xPaths.extra);
          const extraInfoXPaths = extraInfoKeys.map((v) => _xPaths.extra[v]);
          for (let i = 0; i < extraInfoKeys.length; i++) {
            const el = await page.$(`::-p-xpath(${extraInfoXPaths[i]})`);
            if (el) {
              result[extraInfoKeys[i]] = String(
                await (await el.getProperty("textContent")).jsonValue()
              ).trim();
            }
          }
          const currentUrl = page.url();
          if (
            result.stockStatus !== "INELIGIBLE" ||
            result.brandName === "— —"
          ) {
            const url = currentUrl.replace("more-details", "subs-and-alts");
            await this.goto(page, url);
            const resultPromises = [
              page.waitForElement(_xPaths.noAlts),
              page.waitForElement(_xPaths.alts.cin),
            ];
            const i = await Promise.any(
              resultPromises.map((p, i) => p.then(() => i))
            );
            if (i === 0) {
              const _result = await page.getInnerTexts(_xPaths.noAlts);
              if (_result[0]) {
                result.alts = [];
              }
            } else {
              const results = await page.getBatchData(_xPaths.alts);
              result.alts = results;
            }
          }
          if (result.lastOrdered !== "— —") {
            /* max 100 rows */
            const url = currentUrl.replace("more-details", "purchase-history");
            await this.goto(page, url);
            const last36months = await page.waitForElement(
              _xPaths.last36months
            );
            await last36months.click();
            await page.waitForPageRendering();
            await page.waitForElementFade(_xPaths.spinnerLoader);
            const results = await page.getBatchData(_xPaths.purchaseHistory);
            result.purchaseHistory = results;
          }
          return result;
        }
        return new CardinalPuppetError(`Failed to scrape product details.`);
      } catch (e) {
        return new CardinalPuppetError(e.message);
      }
    },
  };
};

module.exports = fn;

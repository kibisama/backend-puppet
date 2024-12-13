const chalk = require("chalk");
const xPaths = require("./xPaths");
const PSPuppetError = require("./PSPuppetError");

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
        await page.waitForElementFade(xPaths.blockUI);
        await page.waitForPageRendering({ minStableSizeIterations: 2 });
      } catch (e) {
        throw e;
      }
    },
    /**
     * @param {Page} page
     * @returns {Promise<undefined> | Promise<PSPuppetError>}
     */
    async signIn(page) {
      console.log(`${chalk[color](name + ":")} Signing in to PharmSaver ...`);
      try {
        const id = process.env.PHARMSAVER_USERNAME;
        const password = process.env.PHARMSAVER_PASSWORD;
        const _xPaths = xPaths.loginPage;
        const inputEls = await page.waitForElements([
          _xPaths.usernameInput,
          _xPaths.passwordInput,
          _xPaths.loginButton,
        ]);
        await inputEls[0].type(id);
        await inputEls[1].type(password);
        await Promise.all([
          page.waitForNavigation(waitForOptions),
          inputEls[2].click(),
        ]);
        await page.waitForElementFade(xPaths.blockUI);
        await page.waitForPageRendering({ minStableSizeIterations: 2 });
        const currentUrl = page.url();
        if (currentUrl === "https://pharmsaver.net/Pharmacy/Default.aspx") {
          console.log(`${chalk[color](name + ":")} Signed in to PharmSaver.`);
          return;
        }
        return new PSPuppetError("Failed to sign in to PharmSaver.");
      } catch (e) {
        return new PSPuppetError(e.message);
      }
    },
    /**
     * @param {Page} page
     * @returns {Promise<undefined|PSPuppetError>}
     */
    async reload(page) {
      console.log(`${chalk[color](name + ":")} Reloading Pharmsaver ...`);
      try {
        let reloaded = false;
        const url = process.env.PHARMSAVER_ADDRESS;
        await this.goto(page, url);
        const currentUrl = page.url();
        if (currentUrl === url) {
          reloaded = true;
        } else {
          if (currentUrl === "https://pharmsaver.net/Login.aspx") {
            const login = await this.signIn(page);
            if (login instanceof PSPuppetError) {
              return login;
            } else {
              reloaded = true;
            }
          }
        }
        if (reloaded) {
          console.log(`${chalk[color](name + ":")} Pharmsaver reloaded.`);
        } else {
          return new PSPuppetError("Failed to reload Pharmsaver.");
        }
      } catch (e) {
        return new PSPuppetError(e.message);
      }
    },
    /**
     * @param {Page} page
     * @param {string} query
     * @returns {Promise<Boolean|PSPuppetError>}
     */
    async search(page, query) {
      console.log(
        `${chalk[color](name + ":")} Searching Pharmsaver "${query}" ...`
      );
      try {
        /* query value must be 11-digit ndc with no hyphens */
        const url = `https://pharmsaver.net/Pharmacy/Order.aspx?q=${query}`;
        await this.goto(page, url);
        const _xPaths = xPaths.orderPage;
        /* via typing query in the search input: query can be anything */
        // const inputEls = await page.waitForElements([
        //   _xPaths.searchInput,
        //   _xPaths.searchButton,
        // ]);
        // await inputEls[0].type(query);
        // await inputEls[1].click();
        // await page.waitForElementFade(xPaths.blockUI);
        // await page.waitForPageRendering({ minStableSizeIterations: 2 });
        const promises = [
          page.waitForElement(_xPaths.inlineOopsImg),
          page.waitForElement(_xPaths.description),
        ];
        const [res, i] = await Promise.any(
          promises.map((p, i) => p.then((res) => [res, i]))
        );
        if (i && res) {
          return true; // Results found
        } else if (res) {
          return false; // Not found
        }
        return new PSPuppetError(`Failed to search for "${query}"`);
      } catch (e) {
        return new PSPuppetError(e.message);
      }
    },
    /**
     * @param {Page} page
     * @returns {Promise<Object> | Promise<PSPuppetError>}
     */
    async collectSearchResults(page) {
      const _xPaths = xPaths.orderPage;
      try {
        const els = await page.waitForElements([
          _xPaths.description,
          _xPaths.str,
          _xPaths.pkg,
          _xPaths.form,
          _xPaths.pkgPrice,
          _xPaths.ndc,
          _xPaths.qtyAvl,
          _xPaths.unitPrice,
          _xPaths.rxOtc,
          _xPaths.lotExpDate,
          _xPaths.bG,
          _xPaths.wholesaler,
          _xPaths.manufacturer,
        ]);
        if (els) {
          console.log(
            `${chalk[color](
              name + ":"
            )} Search results found. Collecting data ...`
          );
          const description = await page.getInnerTexts(_xPaths.description);
          const str = await page.getInnerTexts(_xPaths.str);
          const pkg = await page.getInnerTexts(_xPaths.pkg);
          const form = await page.getInnerTexts(_xPaths.form);
          const pkgPrice = await page.getInnerTexts(_xPaths.pkgPrice);
          const ndc = await page.getInnerTexts(_xPaths.ndc);
          const qtyAvl = await page.getInnerTexts(_xPaths.qtyAvl);
          const unitPrice = await page.getInnerTexts(_xPaths.unitPrice);
          const rxOtc = await page.getInnerTexts(_xPaths.rxOtc);
          const lotExpDate = await page.getInnerTexts(_xPaths.lotExpDate);
          const bG = await page.getInnerTexts(_xPaths.bG);
          const wholesaler = await page.getInnerTexts(_xPaths.wholesaler);
          const manufacturer = await page.getInnerTexts(_xPaths.manufacturer);
          return {
            description,
            str,
            pkg,
            form,
            pkgPrice,
            ndc,
            qtyAvl,
            unitPrice,
            rxOtc,
            lotExpDate,
            bG,
            wholesaler,
            manufacturer,
          };
        }
        return new PSPuppetError(`Failed to collect search results`);
      } catch (e) {
        return new PSPuppetError(e.message);
      }
    },
  };
};

module.exports = fn;

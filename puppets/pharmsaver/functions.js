const chalk = require("chalk");

const fn = (name, color, waitForOptions, xPaths) => {
  return {
    /**
     * @param {Page} page
     * @returns {Promise<undefined> | Promise<Error>}
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
        // await page.waitForPageRendering(5000);
        await page.waitForElementFade(xPaths.modal.blockUI);
        const myAccountButton = await page.waitForElement(
          xPaths.header.myAccountButton
        );
        if (myAccountButton) {
          return;
        }
      } catch (e) {
        return e;
      }
      return new Error("Failed to sign in to PharmSaver");
    },
    /**
     * @param {Page} page
     * @param {string} query
     * @returns {Promise<undefined> | Promise<Error>}
     */
    async search(page, query) {
      console.log(`${chalk[color](name + ":")} Searching ${query} ...`);
      try {
        const _xPaths = xPaths.orderPage;
        const inputEls = await page.waitForElements([
          _xPaths.searchInput,
          _xPaths.searchButton,
        ]);
        await inputEls[0].type(query);
        // await Promise.all([
        //   page.waitForNavigation({
        //     timeout: 300000,
        //     waitUntil: "load",
        //   }),
        //   inputEls[1].click(),
        // ]);
        await inputEls[1].click();
        // await page.waitForPageRendering(5000);
        await page.waitForElementFade(xPaths.modal.blockUI);
        const result = await Promise.any([
          page.waitForElement(_xPaths.description),
          page.waitForElement(_xPaths.inlineOopsImg),
        ]);
        if (result) {
          return;
        }
      } catch (e) {
        return e;
      }
      return new Error(`Failed to search ${query}`);
    },
    /**
     * @param {Page} page
     * @returns {Promise<Object> | Promise<Error>}
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
      } catch (e) {
        return e;
      }
      return new Error(`Failed to collect search results`);
    },
  };
};

module.exports = fn;

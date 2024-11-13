const chalk = require("chalk");
const { Page, ElementHandle } = require("puppeteer");

/**
 * Adds methods to a Page instance.
 * @param {Page} page
 * @param {string} name name of the puppeteer instance
 * @param {string} color chalk color for log
 * @returns {Page}
 */
const extendPage = (page, name, color) => {
  /**
   * A single xPath returns an array of innertexts. Returns an empty array if no result.
   * @param {string} xPath
   * @returns {Promise<[string]> | Promise<undefined>}
   */
  page.getInnerTexts = async (xPath) => {
    try {
      const els = await page.$$(`::-p-xpath(${xPath})`);
      if (els.length > 0) {
        const innerTexts = await Promise.all(
          els.map(async (elHandle) =>
            String(
              await (await elHandle.getProperty("textContent")).jsonValue()
            ).trim()
          )
        );
        return innerTexts;
      }
    } catch (e) {
      console.log(`${chalk[color](name + ":")} ${e.message}`);
    }
    // console.log(
    //   `${chalk[color](name + ":")} No elements with xPath "${xPath}" found`
    // );
    return [];
  };
  /**
   * Waits until the page is fully rendered.
   * @param {Object} options
   * @returns {Promise<undefined>}
   */
  page.waitForPageRendering = async ({
    log = false,
    minWaitingTime = 0,
    timeout = 60000,
    interval = 1000,
    minStableSizeIterations = 3,
  }) => {
    try {
      const maxCount = timeout / interval;
      let count = 0;
      let lastHTMLSize = 0;
      let countStableSizeIterations = 0;
      if (minWaitingTime) {
        await new Promise((r) => setTimeout(r, minWaitingTime));
      }
      while (count++ < maxCount) {
        let currentHTMLSize;
        let bodyHTMLSize;
        let html = await page.content();
        currentHTMLSize = html.length;
        bodyHTMLSize = await page.evaluate(
          () => document.body.innerHTML.length
        );

        if (log) {
          console.log(
            `${chalk[color](
              name + ":"
            )} last: ${lastHTMLSize}  current: ${currentHTMLSize}  body HTML size: ${bodyHTMLSize}`
          );
        }
        if (lastHTMLSize !== 0 && currentHTMLSize === lastHTMLSize)
          countStableSizeIterations++;
        else countStableSizeIterations = 0;
        if (countStableSizeIterations >= minStableSizeIterations) {
          if (log) {
            console.log(`${chalk[color](name + ":")} Page rendered completely`);
          }
          break;
        }
        lastHTMLSize = currentHTMLSize;
        await new Promise((r) => setTimeout(r, interval));
      }
    } catch (e) {
      console.log(`${chalk[color](name + ":")} ${e.message}`);
    }
  };
  /**
   * Waits until the target ElementHandle with a given xPath found.
   * A single xPath returns a single ElementHandle. Returns undefined if no result.
   * @param {string} xPath
   * @param {number} timeout
   * @returns {Promise<ElementHandle> | Promise<undefined>}
   */
  page.waitForElement = async (xPath, timeout = 30000) => {
    const interval = 1000;
    const maxCount = timeout / interval;
    let count = 0;
    let el;
    try {
      while (count++ < maxCount) {
        const _el = await page.$(`::-p-xpath(${xPath})`);
        if (_el) {
          el = _el;
          break;
        }
        await new Promise((r) => setTimeout(r, interval));
      }
      if (!el) {
        // console.log(
        //   `${chalk[color](name + ":")} No ElementHandle "${xPath}" found`
        // );
        return;
      }
      return el;
    } catch (e) {
      console.log(`${chalk[color](name + ":")} ${e.message}`);
    }
  };
  /**
   * Waits until all the target elements found.
   * An array of xPaths returns an array of ElementHandles. Returns undefined if no result.
   * @param {[string]} xPathArray
   * @param {number} timeout
   * @returns {Promise<[ElementHandle]> | Promise<undefined>}
   */
  page.waitForElements = async (xPathArray, timeout = 60000) => {
    const interval = 1000;
    const maxCount = timeout / interval;
    let count = 0;
    while (count++ < maxCount) {
      try {
        const els = await Promise.all(
          xPathArray.map(async (xPath) => await page.$(`::-p-xpath(${xPath})`))
        );
        const noResult = els.indexOf(null);
        if (noResult > -1) {
          // console.log(
          //   `${chalk[color](name + ":")} Cannot find element "${
          //     xPathArray[noResult]
          //   }" ... waiting another interval`
          // );
          await new Promise((r) => setTimeout(r, interval));
        } else {
          return els;
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
      }
    }
    // console.log(
    //   `${chalk[color](
    //     name + ":"
    //   )} One or more elements from the given xPath array not found`
    // );
  };
  /**
   * Waits until the target element (such as a progress image) disappears.
   * Returns the target ElementHandle if still rendered after waiting.
   * @param {string} xPath
   * @param {number} minWaitingTime
   * @param {number} timeout
   * @returns {Promise<undefined> | Promise<ElementHandle>}
   */
  page.waitForElementFade = async (
    xPath,
    minWaitingTime = 0,
    timeout = 60000
  ) => {
    const interval = 3000;
    const maxCount = timeout / interval;
    let count = 0;
    if (minWaitingTime) {
      await new Promise((r) => setTimeout(r, minWaitingTime));
    }
    try {
      let targetEl;
      while (count++ < maxCount) {
        targetEl = await page.$(`::-p-xpath(${xPath})`);
        if (targetEl) {
          // console.log(
          //   `${chalk[color](
          //     name + ":"
          //   )} Waiting for ${xPath} to be disappeared ...`
          // );
          await new Promise((r) => setTimeout(r, interval));
        } else {
          return;
        }
      }
      return targetEl;
    } catch (e) {
      console.log(`${chalk[color](name + ":")} ${e.message}`);
    }
  };
  return page;
};

module.exports = extendPage;

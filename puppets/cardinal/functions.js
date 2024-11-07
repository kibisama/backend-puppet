const chalk = require("chalk");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
const CardinalPuppetError = require("./CardinalPuppetError");

const fn = (name, color, xPaths) => {
  return {
    async signIn(page, id, password) {
      console.log(
        `${chalk[color](name + ":")} Signing in to Order Express ...`
      );
      try {
        await page.type('input[id="okta-signin-username"]', id);
        await page.type('input[id="okta-signin-password"]', password);
        await Promise.all([
          page.waitForNavigation(),
          page.click('input[id="okta-signin-submit"]'),
        ]);
        await page.waitForPageRendering(15000);
        const home = await page.waitForElement(xPaths.menu.home);
        if (home) {
          return page;
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      return new CardinalPuppetError(
        "Failed to sign in to Order Express. Please try later"
      );
    },
    async pressMenu(page, name) {
      console.log(
        `${chalk[color](name + ":")} Getting into Order History page ...`
      );
      let menuButton;
      let targetEl;
      switch (name) {
        case "Order History":
          menuButton = xPaths.menu.orderHistory;
          targetEl = xPaths.orderHistory.findInvoice;
          break;
        default:
          return new CardinalPuppetError("Incorrect argument");
      }
      try {
        const _menuButton = await page.waitForElement(menuButton);
        if (_menuButton) {
          await Promise.all([page.waitForNavigation(), _menuButton.click()]);
          await page.waitForPageRendering();
          const _targetEl = await page.waitForElement(targetEl);
          if (_targetEl) {
            return page;
          }
        }
      } catch (e) {
        `${chalk[color](name + ":")} ${e.message}`;
        return e;
      }
      return new CardinalPuppetError(`Failed to click ${menuButton}`);
    },

    async inputHomeSearchBar(page, ndc11) {
      console.log(
        `${chalk[color](name + ":")} Searching item info ${ndc11} ...`
      );
      try {
        const searchBar = await page.waitForElements([
          xPaths.menu.searchBar,
          xPaths.menu.submitSearch,
        ]);
        await searchBar[0].type(ndc11, { delay: 100 });
        await Promise.all([page.waitForNavigation(), searchBar[1].click()]);
        await page.waitForPageRendering();
      } catch (e) {
        `${chalk[color](name + ":")} ${e.message}`;
        return e;
      }
    },

    async findInvoiceNumbersByDate(page, date) {
      console.log(`${chalk[color](name + ":")} Finding Invoice ...`);
      try {
        const invoiceViewSelected = await page.waitForElement(
          xPaths.orderHistory.invoiceViewSelected,
          500
        );
        if (!invoiceViewSelected) {
          const invoiceViewSelector = await page.waitForElement(
            xPaths.orderHistory.invoiceViewSelector
          );
          if (invoiceViewSelector) {
            await invoiceViewSelector.select("last_thirty_days");
            const findInvoiceButton = await page.waitForElement(
              xPaths.orderHistory.findInvoice
            );
            if (findInvoiceButton) {
              await Promise.all([
                page.waitForNavigation(),
                findInvoiceButton.click(),
              ]);
              await page.waitForPageRendering();
              await page.waitForElement(xPaths.orderHistory.either30Days);
            } else {
              return new CardinalPuppetError("Cannot find Find Invoice Button");
            }
          }
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return;
      }
      const targetDayjs = date ? dayjs(date, "MM/DD/YYYY") : dayjs();
      const targetDate = targetDayjs.format("MM/DD/YYYY");
      const targetXPath = `//td[@class= "colDateShort cahTableCellBorder"] //span[contains(text(), "${targetDate}")] /.. /.. //td[@class= "colSO cahTableCellBorder"] //a`;
      try {
        while (true) {
          const _invoiceNumbers = await page.getInnerTexts(targetXPath);
          if (_invoiceNumbers.length === 0) {
            const someShipDate = (
              await page.getInnerTexts(xPaths.orderHistory.shipDate)
            )[0];
            if (!someShipDate) {
              return new CardinalPuppetError("Cannot get invoice date texts");
            }
            const someShipDayjs = dayjs(someShipDate);
            if (targetDayjs.isBefore(someShipDayjs, "day")) {
              const threeMonthsBefore = targetDayjs.subtract(3, "month");
              if (someShipDayjs.isSameOrAfter(threeMonthsBefore, "day")) {
                const next30DaysLink = await page.waitForElement(
                  xPaths.orderHistory.next30Days
                );
                if (next30DaysLink) {
                  console.log(
                    `${chalk[color](
                      name + ":"
                    )} Target invoice not found. Searching next 30 days ...`
                  );
                  Promise.all([
                    page.waitForNavigation(),
                    next30DaysLink.click(),
                  ]);
                  await page.waitForPageRendering();
                  await page.waitForElement(xPaths.orderHistory.either30Days);
                  continue;
                }
              }
            } else {
              if (targetDayjs.isAfter(someShipDayjs, "day")) {
                const threeMonthsAfter = targetDayjs.add(3, "month");
                if (someShipDayjs.isSameOrBefore(threeMonthsAfter, "day")) {
                  const prev30DaysLink = await page.waitForElement(
                    xPaths.orderHistory.prev30Days
                  );
                  if (prev30DaysLink) {
                    console.log(
                      `${chalk[color](
                        name + ":"
                      )} Target invoice not found. Searching previous 30 days ...`
                    );
                    Promise.all([
                      page.waitForNavigation(),
                      prev30DaysLink.click(),
                    ]);
                    await page.waitForPageRendering();
                    await page.waitForElement(xPaths.orderHistory.either30Days);
                    continue;
                  }
                }
              }
            }
            console.log(
              `${chalk[color](name + ":")} Cannot find Invoice. End of search`
            );
            break;
          } else {
            return [...new Set(_invoiceNumbers)];
          }
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      return [];
    },
    async collectInvoiceDetail(page, back) {
      const _xPaths = xPaths.invoiceDetail;
      try {
        const els = await page.waitForElements([
          _xPaths.invoiceNumber,
          _xPaths.invoiceDate,
          _xPaths.orderNumber,
          _xPaths.orderDate,
          _xPaths.poNumber,
          _xPaths.cin,
          _xPaths.ndcupc,
          _xPaths.tradeName,
          _xPaths.form,
          _xPaths.origQty,
          _xPaths.orderQty,
          _xPaths.shipQty,
          _xPaths.omitCode,
        ]);
        if (els) {
          const invoiceNumber = (
            await page.getInnerTexts(_xPaths.invoiceNumber)
          )[0];
          console.log(
            `${chalk[color](
              name + ":"
            )} Invoice ${invoiceNumber} found. Collecting data ...`
          );
          const _invoiceDate = (
            await page.getInnerTexts(_xPaths.invoiceDate)
          )[0];
          const invoiceDate = _invoiceDate.substring(
            0,
            _invoiceDate.indexOf(" ")
          );
          const orderNumber = (
            await page.getInnerTexts(_xPaths.orderNumber)
          )[0];
          const _orderDate = (await page.getInnerTexts(_xPaths.orderDate))[0];
          const orderDate = _orderDate.substring(0, _orderDate.indexOf(" "));
          const poNumber = (await page.getInnerTexts(_xPaths.poNumber))[0];

          const cin = await page.getInnerTexts(_xPaths.cin);
          const ndcupc = await page.getInnerTexts(_xPaths.ndcupc);
          const tradeName = await page.getInnerTexts(_xPaths.tradeName);
          const form = await page.getInnerTexts(_xPaths.form);
          const origQty = await page.getInnerTexts(_xPaths.origQty);
          const orderQty = await page.getInnerTexts(_xPaths.orderQty);
          const shipQty = await page.getInnerTexts(_xPaths.shipQty);
          const omitCode = await page.getInnerTexts(_xPaths.omitCode);

          const classCol = await page.$(`::-p-xpath(${_xPaths.classCol})`);
          let cost,
            itemClass = [];
          if (classCol) {
            cost = await page.getInnerTexts(_xPaths.costWithClassCol);
            itemClass = await page.getInnerTexts(_xPaths.costWithNoClassCol);
          } else {
            cost = await page.getInnerTexts(_xPaths.costWithNoClassCol);
          }
          if (back) {
            const backToOrderHistory = await page.waitForElement(
              _xPaths.backToOrderHistory
            );
            if (backToOrderHistory) {
              const navigationPromise = page.waitForNavigation();
              await backToOrderHistory.click();
              await navigationPromise;
              await page.waitForPageRendering();
            } else {
              return new CardinalPuppetError("Failed to navigate back");
            }
          }
          return {
            invoiceNumber,
            invoiceDate,
            orderNumber,
            orderDate,
            poNumber,
            cin,
            ndcupc,
            tradeName,
            form,
            origQty,
            orderQty,
            shipQty,
            omitCode,
            cost,
            itemClass,
          };
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      return new CardinalPuppetError("Failed to collect invoice data");
    },
  };
};

module.exports = fn;

const chalk = require("chalk");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
const CardinalPuppetError = require("./CardinalPuppetError");

const fn = (name, color, waitForOptions, xPaths) => {
  return {
    async signIn(page) {
      console.log(
        `${chalk[color](name + ":")} Signing in to Order Express ...`
      );
      try {
        const id = process.env.CARDINAL_USERNAME;
        const password = process.env.CARDINAL_PASSWORD;
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
      return new CardinalPuppetError("Failed to collect Invoice Detail");
    },
    async collectProductDetails(page) {
      const _xPaths = xPaths.productDetails;
      try {
        const els = await page.waitForElements([
          _xPaths.title,
          _xPaths.fdbLabelName,
          _xPaths.genericName,
          _xPaths.cin,
          _xPaths.ndc,
          _xPaths.upc,
          _xPaths.contract,
          _xPaths.strength,
          _xPaths.form,
          _xPaths.stockStatus,
          _xPaths.qtyAvailable,
          _xPaths.estNetCost,
          _xPaths.netUoiCost,
          _xPaths.retailPriceChanged,
          _xPaths.fdbMfrName,
          _xPaths.packageQty,
          _xPaths.packageSize,
          _xPaths.productType,
          _xPaths.unit,
          _xPaths.deaSchedule,
          _xPaths.abRating,
          _xPaths.returnPackaging,
          _xPaths.specialty,
        ]);
        if (els) {
          console.log(
            `${chalk[color](
              name + ":"
            )} Product details found. Collecting data ...`
          );
          const title = (await page.getInnerTexts(_xPaths.title))[0];
          const fdbLabelName = (await page.getInnerTexts(_xPaths.title))[0];
          const genericName = (
            await page.getInnerTexts(_xPaths.genericName)
          )[0];
          const cin = (await page.getInnerTexts(_xPaths.cin))[0];
          const ndc = (await page.getInnerTexts(_xPaths.ndc))[0];
          const upc = (await page.getInnerTexts(_xPaths.upc))[0];
          const contract = (await page.getInnerTexts(_xPaths.contract))[0];
          const strength = (await page.getInnerTexts(_xPaths.strength))[0];
          const form = (await page.getInnerTexts(_xPaths.form))[0];
          const stockStatus = (
            await page.getInnerTexts(_xPaths.stockStatus)
          )[0];
          const qtyAvailable = (
            await page.getInnerTexts(_xPaths.qtyAvailable)
          )[0];
          const estNetCost = (await page.getInnerTexts(_xPaths.estNetCost))[0];
          const netUoiCost = (await page.getInnerTexts(_xPaths.netUoiCost))[0];
          const retailPriceChanged = (
            await page.getInnerTexts(_xPaths.retailPriceChanged)
          )[0];
          const fdbMfrName = (await page.getInnerTexts(_xPaths.fdbMfrName))[0];
          const packageQty = (await page.getInnerTexts(_xPaths.packageQty))[0];
          const packageSize = (
            await page.getInnerTexts(_xPaths.packageSize)
          )[0];
          const productType = (
            await page.getInnerTexts(_xPaths.productType)
          )[0];
          const unit = (await page.getInnerTexts(_xPaths.unit))[0];
          const deaSchedule = (
            await page.getInnerTexts(_xPaths.deaSchedule)
          )[0];
          const abRating = (await page.getInnerTexts(_xPaths.abRating))[0];
          const returnPackaging = (
            await page.getInnerTexts(_xPaths.returnPackaging)
          )[0];
          const specialty = (await page.getInnerTexts(_xPaths.specialty))[0];

          const alternativesTab = await page.waitForElement(
            _xPaths.alternativesTab
          );
          let altCin,
            altNdc,
            altTradeName,
            altMfr,
            altSize,
            altType,
            altNetCost,
            altNetUoiCost,
            altContract = [];
          if (alternativesTab) {
            await alternativesTab.click();
            const inProgresImg = await page.waitForElementFade(
              _xPaths.inProgressImg,
              3000
            );
            if (inProgresImg) {
              return new CardinalPuppetError(
                "Failed to collect Product Details"
              );
            }
            const altDisclaimerMsg = await page.waitForElement(
              _xPaths.altDisclaimerMsg
            );
            if (altDisclaimerMsg) {
              const noAltMsg = await page.waitForElement(_xPaths.noAltMsg, 500);
              if (!noAltMsg) {
                const els = await page.waitForElements([
                  _xPaths.altCin,
                  _xPaths.altNdc,
                  _xPaths.altTradeName,
                  _xPaths.altMfr,
                  _xPaths.altSize,
                  _xPaths.altType,
                  _xPaths.altNetCost,
                  _xPaths.altNetUoiCost,
                  _xPaths.altContract,
                ]);
                if (els) {
                  altCin = await page.getInnerTexts(_xPaths.altCin);
                  altNdc = await page.getInnerTexts(_xPaths.altNdc);
                  altTradeName = await page.getInnerTexts(_xPaths.altTradeName);
                  altMfr = await page.getInnerTexts(_xPaths.altMfr);
                  altSize = await page.getInnerTexts(_xPaths.altSize);
                  altType = await page.getInnerTexts(_xPaths.altType);
                  altNetCost = await page.getInnerTexts(_xPaths.altNetCost);
                  altNetUoiCost = await page.getInnerTexts(
                    _xPaths.altNetUoiCost
                  );
                  altContract = await page.getInnerTexts(_xPaths.altContract);
                }
              }
            }
          }
          let histInvoiceDate,
            histShipQty,
            histUnitCost,
            histContract,
            histInvoiceNumber,
            histOrderMethod = [];
          const lastPurchasedImg = await page.$(
            'img[class="last_purchased_img"]'
          );
          if (lastPurchasedImg) {
            const purchaseHistoryTab = await page.waitForElement(
              _xPaths.purchaseHistoryTab
            );
            if (purchaseHistoryTab) {
              await purchaseHistoryTab.click();
              const inProgresImg = await page.waitForElementFade(
                _xPaths.inProgressImg,
                3000
              );
              if (inProgresImg) {
                return new CardinalPuppetError(
                  "Failed to collect Product Details"
                );
              }
              const viewSelector = await page.waitForElement(
                _xPaths.viewSelector
              );
              if (viewSelector) {
                await viewSelector.select("details");
                const inProgresImg = await page.waitForElementFade(
                  _xPaths.inProgressImg,
                  3000
                );
                if (inProgresImg) {
                  return new CardinalPuppetError(
                    "Failed to collect Product Details"
                  );
                }
                const els = await page.waitForElements([
                  _xPaths.histInvoiceDate,
                  _xPaths.histShipQty,
                  _xPaths.histUnitCost,
                  _xPaths.histContract,
                  _xPaths.histInvoiceNumber,
                  _xPaths.histOrderMethod,
                ]);
                if (els) {
                  histInvoiceDate = await page.getInnerTexts(
                    _xPaths.histInvoiceDate
                  );
                  histShipQty = await page.getInnerTexts(_xPaths.histShipQty);
                  histUnitCost = await page.getInnerTexts(_xPaths.histUnitCost);
                  histContract = await page.getInnerTexts(_xPaths.histContract);
                  histInvoiceNumber = await page.getInnerTexts(
                    _xPaths.histInvoiceNumber
                  );
                  histOrderMethod = await page.getInnerTexts(
                    _xPaths.histOrderMethod
                  );
                }
              }
            }
          }
          return {
            title,
            fdbLabelName,
            genericName,
            cin,
            ndc,
            upc,
            contract,
            strength,
            form,
            stockStatus,
            qtyAvailable,
            estNetCost,
            netUoiCost,
            retailPriceChanged,
            fdbMfrName,
            packageQty,
            packageSize,
            productType,
            unit,
            deaSchedule,
            abRating,
            returnPackaging,
            specialty,
            altCin,
            altNdc,
            altTradeName,
            altMfr,
            altSize,
            altType,
            altNetCost,
            altNetUoiCost,
            altContract,
            histInvoiceDate,
            histShipQty,
            histUnitCost,
            histContract,
            histInvoiceNumber,
            histOrderMethod,
          };
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      return new CardinalPuppetError("Failed to collect Product Details");
    },
  };
};

module.exports = fn;

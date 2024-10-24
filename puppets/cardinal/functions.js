const chalk = require("chalk");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

const fn = (name, color, xPaths) => {
  return {
    async signIn(page, id, password) {
      console.log(
        `${chalk[color](name + ":")} Signing in to Order Express ...`
      );
      try {
        await page.type('input[id="okta-signin-username"]', id);
        await page.type('input[id="okta-signin-password"]', password);
        await page.click('input[id="okta-signin-submit"]');
        await page.waitForNavigation();
        await page.waitForPageRendering(15000);
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      try {
        const home = await page.waitForElement(xPaths.menu.home);
        if (home) {
          return page;
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      return new Error("Unable to sign in to Order Express. Please try later");
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
          return Error("Incorrect argument");
      }
      try {
        const _menuButton = await page.waitForElement(menuButton);
        if (_menuButton) {
          await _menuButton.click();
          await page.waitForNavigation();
          await page.waitForPageRendering(15000);
          const _targetEl = await page.waitForElement(targetEl);
          if (_targetEl) {
            return page;
          }
        }
      } catch (e) {
        `${chalk[color](name + ":")} ${e.message}`;
        return e;
      }
      return new Error(`Failed to click ${menuButton}`);
    },
    async findInvoiceNumbersByDate(page, date) {
      console.log(`${chalk[color](name + ":")} Finding Invoice ...`);
      try {
        const invoiceViewSelected = await page.waitForElement(
          xPaths.orderHistory.invoiceViewSelected,
          5000
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
              await findInvoiceButton.click();
              await page.waitForNavigation();
              await page.waitForPageRendering();
              await page.waitForElement(xPaths.orderHistory.either30Days);
            } else {
              return new Error("Cannot find Find Invoice Button");
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
              return new Error("Cannot get invoice date texts");
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
                  await next30DaysLink.click();
                  await page.waitForNavigation();
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
                    await prev30DaysLink.click();
                    await page.waitForNavigation();
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
      return new Error("Failed to find invoice numbers");
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
          _xPaths.totalShipped,
          _xPaths.totalAmount,
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
          const totalShipped = (
            await page.getInnerTexts(_xPaths.totalShipped)
          )[0];
          const totalAmount = (
            await page.getInnerTexts(_xPaths.totalAmount)
          )[0];

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
            confirmNumber,
            itemClass = [];
          if (classCol) {
            cost = await page.getInnerTexts(_xPaths.costWithClassCol);
            confirmNumber = await page.getInnerTexts(
              _xPaths.confirmNumberWithClassCol
            );
            itemClass = await page.getInnerTexts(_xPaths.costWithNoClassCol);
          } else {
            cost = await page.getInnerTexts(_xPaths.costWithNoClassCol);
            confirmNumber = await page.getInnerTexts(
              _xPaths.confirmNumberWithNoClassCol
            );
          }
          if (back) {
            const backToOrderHistory = await page.waitForElement(
              _xPaths.backToOrderHistory
            );
            if (backToOrderHistory) {
              await backToOrderHistory.click();
              await page.waitForNavigation();
              await page.waitForPageRendering();
            } else {
              return new Error("Failed to navigate back");
            }
          }
          return {
            invoiceNumber,
            invoiceDate,
            orderNumber,
            orderDate,
            poNumber,
            totalShipped,
            totalAmount,
            cin,
            ndcupc,
            tradeName,
            form,
            origQty,
            orderQty,
            shipQty,
            omitCode,
            cost,
            confirmNumber,
            itemClass,
          };
        }
      } catch (e) {
        console.log(`${chalk[color](name + ":")} ${e.message}`);
        return e;
      }
      return new Error("Failed to collect invoice data");
    },
  };
};

module.exports = fn;

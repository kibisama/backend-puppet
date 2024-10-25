const chalk = require("chalk");

const getInvoice = async (req, res, next) => {
  const { name, color, browser, context, page, fn, waitForOptions } =
    req.app.get("cardinalPuppet");
  const { date } = req.body;
  console.log(
    `${chalk[color](name + ":")} Requested to retrieve invoice info ${date} ...`
  );
  try {
    const orderHistoryPage = await fn.pressMenu(page, "Order History");
    if (orderHistoryPage instanceof Error) {
      next(orderHistoryPage);
    }
    const invoiceNumbers = await fn.findInvoiceNumbersByDate(page, date);
    if (invoiceNumbers instanceof Error) {
      next(invoiceNumbers);
    }
    const invoiceDetails = [];
    for (let i = 0; i < invoiceNumbers.length; i++) {
      const invoiceLink = await page.waitForElement(
        `//td[@class= "colSO cahTableCellBorder"] //a[contains(text(), "${invoiceNumbers[i]}")]`
      );
      if (invoiceLink) {
        const navigationPromise = page.waitForNavigation();
        await invoiceLink.click();
        await navigationPromise;
        await page.waitForPageRendering();
        const result = await fn.collectInvoiceDetail(page, true);
        if (result instanceof Error) {
          next(result);
        } else if (result) {
          invoiceDetails.push(result);
        }
      }
    }
    req.app.set("cardinalPuppetOccupied", false);
    return res.send({
      results: {
        invoiceNumbers,
        invoiceDetails,
      },
    });
  } catch (e) {
    console.log(`${chalk[color](name + ":")} ${e.message}`);
    next(e);
  }
};

module.exports = getInvoice;

module.exports = {
  menu: {
    home: '//div[@id= "menu"] //a[contains(text(), "Home")]',
    orderHistory: '//div[@id= "menu"] //a[contains(text(), "Order History")]',
  },
  orderHistory: {
    invoiceViewSelector: '//td[@class= "selectDateTblCol2"] //select',
    // Invoice View Selector with "30+ Days" option selected
    invoiceViewSelected:
      '//td[@class= "selectDateTblCol2"] //select //option[@selected= "selected" and @value="last_thirty_days"]',
    findInvoice: '//td[@class= "selectDateTblColInv3"] //input',
    next30Days:
      '//a[@class= "commandLink"] //span[contains(text(), "Next 30 Days>>")]',
    prev30Days:
      '//a[@class= "commandLink"] //span[contains(text(), "<<Previous 30 Days")]',
    either30Days:
      '//a[@class= "commandLink"] //span[contains(text(), "Next 30 Days>>") or contains(text(), "<<Previous 30 Days")]',
    shipDate:
      '//td[@class= "colDateShort cahTableCellBorder" and position()= 8] //span',
    manageCSOS: '//a[contains(text(), "Manage E222 & CSOS Orders")]',
  },
  invoiceDetail: {
    invoiceNumber:
      '//span[contains(text(), "Invoice #:")] /.. /.. //td[@class= "topPanelGridColumnTwo"] //span[@class= "outputText"]',
    invoiceDate:
      '//tr[position()= 2] //td[@class= "topPanelGridColumnTwo"] //span',
    orderNumber:
      '//span[contains(text(), "Order #:")] /.. /.. //td[@class= "topPanelGridColumnTwoSmall"] //span[@class= "outputText"]',
    orderDate:
      '//tr[position()= 2] //td[@class= "topPanelGridColumnTwoSmall"] //span',
    poNumber:
      '//span[contains(text(), "PO #:")] /.. /.. //td[@class= "topPanelGridColumnTwoSmall"] //span[@class= "outputText"]',
    totalShipped:
      '//span[contains(text(), "Total Pieces Shipped")] /.. /.. //td[position()= 2] //span[@class= "outputText"]',
    totalAmount:
      '//span[contains(text(), "Amount")] /.. /.. //td[position()= 2] //span[@class= "outputText"]',
    classCol:
      '//th[@class= "dataTableBorder"] //span[contains(text(), "Class")]',
    // itemClass:
    //   '//td[@class= "columnLgSmall cahTableCellBorder" and position()= 15]',
    cin: '//td[@class= "columnLgCin cahTableCellBorder"] //a',
    ndcupc: '//td[@class="columnLgFirstTableNdc cahTableCellBorder"] //div',
    tradeName: '//div[@class= "dataTableColNoWrap100"] //a',
    origQty: '//td[@class= "columnLgOrigQty cahTableCellBorder"] //span',
    orderQty: '//td[@class= "columnLgQty cahTableCellBorder"] //span',
    shipQty: '//td[@class= "columnLgShipQty cahTableCellBorder"] //span',
    omitCode:
      '//td[@class= "columnLgSmall cahTableCellBorder" and position()= 8]',
    costWithClassCol:
      '//td[@class= "columnLgPrice_right cahTableCellBorder" and position()= 16]',
    costWithNoClassCol:
      '//td[@class= "columnLgSmall cahTableCellBorder" and position()= 15]',
    confirmNumberWithClassCol:
      '//td[@class= "columnLgSelect cahTableCellBorder" and position()= 18]',
    confirmNumberWithNoClassCol:
      '//td[@class= "columnLgPrice_right cahTableCellBorder" and position()= 17]',
    backToOrderHistory: '//a //span[contains(text(), "Order History")]',
  },
};

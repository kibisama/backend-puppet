module.exports = {
  menu: {
    home: '//div[@id= "menu"] //a[contains(text(), "Home")]',
    orderHistory: '//div[@id= "menu"] //a[contains(text(), "Order History")]',
    searchBar: '//input[@class= "searchBox searchBoxThemeDefaultColor"]',
    submitSearch: '//a[@id= "submitSearch"]',
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
    classCol:
      '//th[@class= "dataTableBorder"] //span[contains(text(), "Class")]',
    // itemClass:
    //   '//td[@class= "columnLgSmall cahTableCellBorder" and position()= 15]',
    cin: '//td[@class= "columnLgCin cahTableCellBorder"] //a',
    ndcupc: '//td[@class="columnLgFirstTableNdc cahTableCellBorder"] //div',
    tradeName: '//div[@class= "dataTableColNoWrap100"] //a',
    form: '//td[@class= "columnLgSize cahTableCellBorder"]',
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
  productDetails: {
    // Tabs & View Selector
    alternativesTab:
      '//div[@class= "tabs"] //span[contains(text(), "Alternatives & Substitutions")]',
    purchaseHistoryTab:
      '//div[@class= "tabs"] //span[contains(text(), "Purchase History")]',
    viewSelector: '//option[contains(text(), "24 Month Summary View")] /..',
    // Data
    title: '//span[@class ="cahMainTitleBarText"]',
    fdbLabelName:
      '//span[contains(text(), "FDB Label Name:")] /.. //span[@class= "outputText"]',
    genericName:
      '//span[contains(text(), "Generic Name:")] /.. /.. //span[@class= "outputText"]',
    cin: '//span[contains(text(), "CIN:")] /.. /.. //span[@class= "outputText"]',
    ndc: '//span[contains(text(), "NDC:")] /.. /.. //span[@class= "outputText"]',
    upc: '//span[contains(text(), "UPC:")] /.. /.. //span[@class= "outputText"]',
    contract:
      '//span[contains(text(), "Contract:")] /.. /.. //span[@class= "outputText"]',
    strength:
      '//span[contains(text(), "Strength:")] /.. /.. //span[@class= "outputText"]',
    form: '//span[contains(text(), "Form:")] /.. /.. //span[@class= "outputText"]',
    stockStatus:
      '//span[contains(text(), "Stock Status:")] /.. //span[@class= "cahStatusTextGreen" or @class= "cahStatusTextYellow" or @class= "cahStatusTextRed"]',
    qtyAvailable:
      '//span[contains(text(), "Quantity Available")] /.. /.. //span[@class= "outputText"] //b',
    invoiceCost:
      '//span[contains(text(), "Invoice Cost:")] /.. /.. /.. //span[@class= "invoiceCost"]',
    retailPriceChanged:
      '//span[contains(text(), "Retail Price Changed:")] /.. /.. //span[@class= "outputText"]',
    fdbMfrName:
      '//span[contains(text(), "FDB Manuf/Dist Name:")] /.. //span[@class= "outputText"]',
    packageQty:
      '//span[contains(text(), "Package Quantity:")] /.. //span[@class= "outputText"]',
    packageSize:
      '//span[contains(text(), "Package Size:")] /.. //span[@class= "outputText"]',
    productType:
      '//span[contains(text(), "Product Type:")] /.. //span[@class= "outputText"]',
    unit: '//span[contains(text(), "Unit of Measure:")] /.. //span[@class= "outputText"]',
    deaSchedule:
      '//span[contains(text(), "DEA Schedule:")] /.. //span[@class= "outputText"]',
    abRating:
      '//span[contains(text(), "AB Rating:")] /.. //span[@class= "outputText"]',
    returnPackaging:
      '//span[contains(text(), "Return Packaging:")] /.. /.. //span[@class= "outputText"]',
    specialty:
      '//span[contains(text(), "Specialty:")] /.. /.. //span[@class= "outputText"]',
    // Temporal tooltip
    purchaseHistory: '//div[@id= "tooltipleftMsgGREEN"]',
  },
};

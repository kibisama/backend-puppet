/* keys end with "_" select multiple elements  */
module.exports = {
  loginPage: {
    usernameInput: '//input[@id="okta-signin-username"]',
    passwordInput: '//input[@id="okta-signin-password"]',
    loginButton: '//input[@id="okta-signin-submit"]',
  },
  search: {
    noResults: '//div[@class="product-results-found"]',
    cin_: '//span[@class="body-2 mb-0 text-black cursor-pointer text-decoration-underline"]',
  },
  product: {
    img: "/html/body/div/main/div[5]/div[1]/div[2]/div[1]/div/div/div/div/img",
    info: {
      /* Required data */
      name: "/html/body/div/main/div[5]/div[1]/div[1]/div/h1",
      genericName: "/html/body/div/main/div[5]/div[1]/div[1]/div/h5",
      ndc: '//div[@class="product-container page-container"]//p[text()="NDC"]/span',
      cin: '//div[@class="product-container page-container"]//p[text()="CIN"]/span',
      upc: '//div[@class="product-container page-container"]//p[text()="UPC"]/span',
      gtin: '//div[@class="product-container page-container"]//p[text()="GTIN"]/span',
      brandName:
        '//div[@class="product-container page-container"]//p[text()="Brand name"]/span',
      mfr: '//div[@class="product-container page-container"]//p[text()="Manufacturer"]/span',
      amu: '//div[@class="product-container page-container"]//p[text()="Average Monthly Usage (AMU)"]/span',
      size: '//div[@class="product-container page-container"]//p[text()="Size"]/span',
      form: '//div[@class="product-container page-container"]//p[text()="Form"]/span',
      strength:
        '//div[@class="product-container page-container"]//p[text()="Strength"]/span',
      orangeBookCode:
        '//div[@class="product-container page-container"]//p[text()="Orange book code"]/span',
      lastOrdered:
        '//div[@class="product-container page-container"]//div[text()="Last ordered"]/span',
      estNetCost: '//div[text()="Estimated net cost"]/../../h5',
      netUoiCost: '//div[text()="Net UOI cost"]/../div[2]',
      // following two elements contain an inner text of "clear" (false) or "done" (true)
      rebateEligible: '//strong[text()="Rebate eligible"]/../span',
      returnable: '//strong[text()="Returnable"]/../span',
      stockStatus:
        "/html/body/div/main/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div/div[6]/div/div/div[1]/span[3]",
      rx: '//td[@class="tab-table"]//p[text()="Rx"]/span',
      deaSchedule: '//td[@class="tab-table"]//p[text()="DEA schedule"]/span',
      productType: '//td[@class="tab-table"]//p[text()="Product type"]/span',
      unitOfMeasure:
        '//td[@class="tab-table"]//p[text()="Unit of measure"]/span',
      refrigerated: '//td[@class="tab-table"]//p[text()="Refrigerated"]/span',
      serialized: '//td[@class="tab-table"]//p[text()="Serialized"]/span',
    },
    contract:
      "/html/body/div/main/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[1]/span/strong",
    // rendered when info.stockStatus !== "INELIGIBLE"
    stock:
      "/html/body/div/main/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[6]/div/div/div[1]/span[1]",
    extra: {
      /* following elements can be missing */
      medispanGpi:
        '//td[@class="tab-table"]//p[text()="Medispan Generic Product Identifier (GPI)"]/span',
      gcn: '//td[@class="tab-table"]//p[text()="GCN"]/span',
      gcnSequence: '//td[@class="tab-table"]//p[text()="GCN sequence"]/span',
    },
    /* Subs & alts */
    noAlts:
      '//span[contains(.,"No substitutions or alternative products are available")]',
    alts: {
      name: '//div[@class="title-section"]//a',
      genericName: '//div[@class="title-section"]/div',
      ndc: '//div[@class="product-info"]//span[text()="NDC"]/..//span[2]',
      cin: '//div[@class="product-info"]//span[text()="CIN"]/..//span[2]',
      upc: '//div[@class="product-info"]//span[text()="UPC"]/..//span[2]',
      mfr: '//div[@class="product-info"]//span[text()="MFR"]/..//span[2]',
      orangeBookCode:
        '//div[@class="product-info"]//span[text()="Orange Book Code"]/..//span[2]',
      estNetCost:
        '//div[@class="product-info"]//span[text()="Est. net cost"]/..//span[2]',
      netUoiCost:
        '//div[@class="product-info"]//span[text()="Net UOI cost"]/..//span[2]',
      contract: '//div[@class="title-section"]//strong',
    },
    /* Purchase history */
    last36months: '//label[text()="Last 36 months"]',
    // note: product page document has a spinner (page loader) element even after fully loaded
    spinnerLoader:
      '//div[@class="table-box-pdp-purchase"]//span[@class="spinner-loader-big"]',
    purchaseHistory: {
      orderDate: '//table[@id="table_data"]/tbody/tr/td[1]/p',
      invoiceDate: '//table[@id="table_data"]/tbody/tr/td[2]/p',
      invoiceCost: '//table[@id="table_data"]/tbody/tr/td[3]/p',
      orderQty: '//table[@id="table_data"]/tbody/tr/td[4]/p',
      shipQty: '//table[@id="table_data"]/tbody/tr/td[5]/p',
      unitCost: '//table[@id="table_data"]/tbody/tr/td[6]/p',
      orderMethod: '//table[@id="table_data"]/tbody/tr/td[7]/p',
      poNumber: '//table[@id="table_data"]/tbody/tr/td[8]/p',
      contract: '//table[@id="table_data"]/tbody/tr/td[9]//strong',
      invoiceNumber: '//table[@id="table_data"]/tbody/tr/td[11]//span',
    },
  },
};

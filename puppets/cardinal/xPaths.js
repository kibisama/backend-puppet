/* keys end with "_" select multiple elements  */
module.exports = {
  loginPage: {
    usernameInput: '//input[@id= "okta-signin-username"]',
    passwordInput: '//input[@id= "okta-signin-password"]',
    loginButton: '//input[@id= "okta-signin-submit"]',
  },
  search: {
    noResults: '//div[@class= "product-results-found"]',
    cin_: '//span[@class= "body-2 mb-0 text-black cursor-pointer text-decoration-underline"]',
  },
  product: {
    name: '//*[@id="cardinal-header"]/div[5]/div[1]/div[1]/div/h1',
    genericName: '//*[@id="cardinal-header"]/div[5]/div[1]/div[1]/div/h5',
    img: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[1]/div/div[1]/div/div[1]/img',
    ndc: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[1]/div/p[1]/span',
    cin: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[1]/div/p[2]/span',
    upc: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[1]/div/p[3]/span',
    gtin: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[1]/div/p[4]/span',
    brandName:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[2]/div[1]/div/p[1]/span',
    mfr: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[2]/div[1]/div/p[2]/span',
    amu: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[3]/div[1]/div/p/span',
    size: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[2]/div/p[1]/span',
    form: '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[2]/div/p[2]/span',
    strength:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[1]/div[2]/div/p[3]/span',
    orangeBookCode:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[2]/div[2]/div/p/span',
    lastOrdered:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[2]/div[3]/div[2]/div/div[1]/span',
    /* Card-container */
    estNetCost:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[3]/h5',
    netUoiCost:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[4]/div[2]',
    // following icons contain an inner text of "clear" (false) or "done" (true)
    rebateEligibleIcon:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[5]/div[1]/span/span',
    returnableIcon:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[5]/div[2]/span/span',
    stock:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[6]/div[1]/div/div[1]/span[1]',
    stockStatus:
      '//*[@id="cardinal-header"]/div[5]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/div/div[2]/div[6]/div[1]/div/div[1]/span[3]',
    /* More details: data positions are not consistent */
    rx: '//td[@class= "tab-table"] //p[text()= "Rx"] //span',
    deaSchedule: '//td[@class= "tab-table"] //p[text()= "DEA schedule"] //span',
    productType: '//td[@class= "tab-table"] //p[text()= "Product type"] //span',
    medispanGpi:
      '//td[@class= "tab-table"] //p[text()= "Medispan Generic Product Identifier (GPI)"] //span',
    gcn: '//td[@class= "tab-table"] //p[text()= "GCN"] //span',
    gcnSequence: '//td[@class= "tab-table"] //p[text()= "GCN sequence"] //span',
    unitOfMeasure:
      '//td[@class= "tab-table"] //p[text()= "Unit of measure"] //span',
    refrigerated:
      '//td[@class= "tab-table"] //p[text()= "Refrigerated"] //span',
    serialized: '//td[@class= "tab-table"] //p[text()= "Serialized"] //span',
  },
};

module.exports = {
  header: {
    myAccountButton: '//button[@title= "Manage Account and Logout"]',
  },
  modal: {
    blockUI: '//div[@class= "blockUI blockMsg blockPage"]',
  },
  loginPage: {
    usernameInput: '//input[@placeholder= "Username"]',
    passwordInput: '//input[@type= "password"]',
    loginButton: '//input[@value= "Login"]',
  },
  orderPage: {
    searchInput: '//input[@id= "txtSearchValue"]',
    searchButton: '//button[@id= "SearchButton"]',
    // Rendered when no results found
    inlineOopsImg: '//img[@id= "OopsImg" and @style="display: inline;"]',
    // Search results
    description: '//td[@key= "DrugNameText"]',
    str: '//td[@key= "StrengthText"]',
    pkg: '//td[@key= "PackageSize"]',
    form: '//td[@key= "DosageFormText"]',
    pkgPrice: '//td[@key= "UnitPrice"]',
    ndc: '//td[@key= "NDCText"]',
    qtyAvl: '//td[@key= "QuantityAvailable"]',
    unitPrice: '//td[@key= "ItemPrice"]',
    rxOtc: '//td[@key= "RXOTCText"]',
    lotExpDate: '//td[@key= "LotExpiresDate"]',
    bG: '//td[@key= "BrandNameCodeText"]',
    wholesaler: '//td[@key= "WholesalerNameText"]',
    manufacturer: '//td[@key= "ManufacturerNameTxt"]',
  },
};
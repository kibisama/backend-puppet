const express = require("express");
// const getInvoice = require("../controllers/cardinal/getInvoice");
const getProductDetails = require("../controllers/cardinal/getProductDetails");
const reload = require("../controllers/cardinal/reload");
const end = require("../controllers/cardinal/end");

const router = express.Router();

router.use(reload);
// router.post("/getInvoice", getInvoice);
router.post("/getProductDetails", getProductDetails);
router.use(end);

module.exports = router;

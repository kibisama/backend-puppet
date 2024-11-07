const express = require("express");
const getInvoice = require("../controllers/cardinal/getInvoice");
const updateItem = require("../controllers/cardinal/updateItem");
const reload = require("../controllers/cardinal/reload");

const router = express.Router();

router.use(reload);
router.post("/getInvoice", getInvoice);
router.post("/updateItem", updateItem);

module.exports = router;

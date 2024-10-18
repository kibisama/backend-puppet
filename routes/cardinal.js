const express = require("express");
const getInvoice = require("../controllers/cardinal/getInvoice");
const reload = require("../controllers/cardinal/reload");

const router = express.Router();

router.use(reload);
router.post("/getInvoice", getInvoice);

module.exports = router;

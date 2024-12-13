const express = require("express");
const reload = require("../controllers/pharmsaver/reload");
const end = require("../controllers/pharmsaver/end");
const getSearchResults = require("../controllers/pharmsaver/getSearchResults");

const router = express.Router();

router.use(reload);
router.post("/getSearchResults", getSearchResults);
router.use(end);

module.exports = router;

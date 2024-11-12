const express = require("express");
const reload = require("../controllers/pharmsaver/reload");
const updateSearch = require("../controllers/pharmsaver/updateSearch");

const router = express.Router();

router.use(reload);
router.post("/updateSearch", updateSearch);

module.exports = router;

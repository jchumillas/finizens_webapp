var router = require("express").Router();

router.use("/agenda", require("./agenda"));

module.exports = router;

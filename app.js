const express = require("express");
const app = express();
const router = express.Router();

app.use(express.static(`${__dirname}/public`));

const formHandler = (req, res, next) => {
	res.send("Hello Word");
};

router.route("/").post(formHandler);

module.exports = app;

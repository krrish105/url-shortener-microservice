const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");

const app = express();

dotenv.config({ path: "./config.env" });

mongoose
	.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
	})
	.then((con) => console.log("DB CONNECTION SUCCESSFUL"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

const urlSchema = new mongoose.Schema({
	original_url: {
		type: String,
		required: [true, "Original Url is required"],
		trim: true,
		unique: true,
	},
});

const URL = mongoose.model("Url", urlSchema);

app.get("/", (req, res) => {
	// res.status(200).send();
});

app.post("/api/shorturl/new", (req, res) => {
	try {
		const bodyurl = req.body.original_url;
		dns.lookup(
			urlParser.parse(bodyurl).hostname,
			async (err, address, family) => {
				if (err) {
					res.status(404).json(err);
					return;
				}
				if (address) {
					const c = await URL.create({ original_url: bodyurl });
					res.status(200).json(c);
				}
			}
		);
	} catch (err) {
		res.status(404).send(err);
	}
});

app.get("/api/shorturl/:id", async (req, res) => {
	try {
		const url = await URL.findById(req.params.id);
		res.redirect(url.original_url);
	} catch (err) {
		res.status(404).send(err);
	}
});

const port = 3000;
app.listen(port, () => {
	console.log("App running on port " + port);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ShortId = require("shortid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
  clicks: { type: Number, default: 0 },
});

const URL = mongoose.model("URL", urlSchema);

app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const shortUrl = ShortId.generate();

  const newUrl = new URL({ shortUrl, longUrl });
  await newUrl.save();

  res.json({ shortUrl, longUrl });
});

app.get("/:shortUrl", async (req, res) => {
  const url = await URL.findOne({ shortUrl: req.params.shortUrl });

  if (url) {
    url.clicks++;
    await url.save();
    res.redirect(url.longUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

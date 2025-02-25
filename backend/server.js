require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ShortId = require("shortid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const urlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
  clicks: { type: Number, default: 0 },
});

const URL = mongoose.model("URL", urlSchema);

app.post("/shorten", async (req, res) => {
  const { longUrl, customShortUrl } = req.body;
  let shortUrl;

  // Check if a custom short URL is provided
  if (customShortUrl) {
    // Ensure the custom short URL is unique
    const existingUrl = await URL.findOne({ shortUrl: customShortUrl });
    if (existingUrl) {
      return res.status(400).json({ error: "Custom short URL already taken" });
    }
    shortUrl = customShortUrl;
  } else {
    shortUrl = ShortId.generate();
  }

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

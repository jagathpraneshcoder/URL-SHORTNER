require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ShortId = require("shortid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Fix MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define URL Schema
const urlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
  clicks: { type: Number, default: 0 },
});

const URL = mongoose.model("URL", urlSchema);

// ✅ Shorten URL Route
app.post("/shorten", async (req, res) => {
  let { longUrl, customShortUrl } = req.body;

  // 🔹 Add "https://" if missing
  if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
    longUrl = "https://" + longUrl;
  }

  let shortUrl = customShortUrl || ShortId.generate();

  const existingUrl = await URL.findOne({ shortUrl });
  if (existingUrl) {
    return res.status(400).json({ error: "Custom short URL already taken" });
  }

  const newUrl = new URL({ shortUrl, longUrl });
  await newUrl.save();

  res.json({ shortUrl, longUrl });
});

// ✅ Redirect Route
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

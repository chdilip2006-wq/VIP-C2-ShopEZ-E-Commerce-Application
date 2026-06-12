import StoreConfig from "../models/StoreConfig.js";

export async function getStoreConfig(req, res) {
  const config = await StoreConfig.findOneAndUpdate(
    { key: "primary" },
    { $setOnInsert: { key: "primary" } },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(config);
}

export async function updateStoreConfig(req, res) {
  const update = {};
  if (typeof req.body.bannerURL === "string") update.bannerURL = req.body.bannerURL;
  if (Array.isArray(req.body.categories)) {
    update.categories = req.body.categories.map((item) => item.trim()).filter(Boolean);
  }
  const config = await StoreConfig.findOneAndUpdate(
    { key: "primary" },
    { $set: update, $setOnInsert: { key: "primary" } },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(config);
}

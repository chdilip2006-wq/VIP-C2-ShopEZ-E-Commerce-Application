import mongoose from "mongoose";

const storeConfigSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "primary" },
    bannerURL: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1600&q=85"
    },
    categories: {
      type: [String],
      default: ["Mobiles", "Electronics", "Sports Equipment", "Fashion", "Groceries", "Home"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("StoreConfig", storeConfigSchema);

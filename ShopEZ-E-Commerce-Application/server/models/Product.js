import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    category: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Not applicable"],
      default: "Not applicable"
    },
    sizes: { type: [String], default: [] },
    stockCount: { type: Number, required: true, min: 0, default: 0 },
    imageURL: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

productSchema.pre("validate", function normalizePricing(next) {
  if (this.originalPrice == null) this.originalPrice = this.price;
  next();
});

export default mongoose.model("Product", productSchema);

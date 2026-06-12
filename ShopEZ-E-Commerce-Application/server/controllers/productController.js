import Product from "../models/Product.js";

export async function listProducts(req, res) {
  const { category, search, sort = "newest", featured, gender, maxPrice } = req.query;
  const filter = {};
  if (category && category !== "all") filter.category = category;
  if (gender && gender !== "all") filter.gender = gender;
  if (maxPrice && Number.isFinite(Number(maxPrice))) filter.price = { $lte: Number(maxPrice) };
  if (featured === "true") filter.featured = true;
  if (search) {
    const term = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } }
    ];
  }

  const sorts = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
    discount: { discount: -1 }
  };
  const products = await Product.find(filter).sort(sorts[sort] || sorts.newest);
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
}

export async function categories(req, res) {
  res.json(await Product.distinct("category"));
}

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export async function createOrder(req, res) {
  const {
    items,
    shippingAddress,
    paymentId,
    paymentMethod,
    specificRequirements,
    isPaid = false
  } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  const products = await Product.find({ _id: { $in: items.map((item) => item.product) } });
  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = productMap.get(item.product);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "One or more cart items are invalid" });
    }
    if (product.stockCount < quantity) {
      return res.status(409).json({ message: `${product.name} has insufficient stock` });
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      imageURL: product.imageURL,
      price: product.price,
      quantity,
      size: item.size || undefined
    });
    totalPrice += product.price * quantity;
  }

  totalPrice += totalPrice >= 2000 ? 0 : 199;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    specificRequirements,
    totalPrice,
    isPaid,
    paidAt: isPaid ? new Date() : undefined,
    paymentId,
    status: isPaid ? "Processing" : "Pending"
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stockCount: -item.quantity } })
    )
  );
  res.status(201).json(order);
}

export async function myOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}

export async function allOrders(req, res) {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
}

export async function updateOrderStatus(req, res) {
  const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

export async function cancelMyOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!["Pending", "Processing"].includes(order.status)) {
    return res.status(409).json({ message: "This order can no longer be cancelled" });
  }

  order.status = "Cancelled";
  await order.save();
  await Promise.all(
    order.orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stockCount: item.quantity } })
    )
  );
  res.json(order);
}

export async function dashboardStats(req, res) {
  const [orders, products, users, revenueResult] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ])
  ]);
  res.json({ orders, products, users, revenue: revenueResult[0]?.revenue || 0 });
}

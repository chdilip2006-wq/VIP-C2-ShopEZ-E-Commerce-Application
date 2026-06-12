import { Edit3, Image, Package, Plus, ShoppingCart, Trash2, Users, WalletCards, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { money } from "../utils/format";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  discount: 0,
  category: "",
  gender: "Not applicable",
  sizes: [],
  stockCount: "",
  imageURL: "",
  rating: 4.5,
  featured: false
};

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [config, setConfig] = useState({ bannerURL: "", categories: [] });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [productResponse, orderResponse, statsResponse, userResponse, configResponse] =
        await Promise.all([
          api.get("/products"),
          api.get("/orders"),
          api.get("/orders/admin/stats"),
          api.get("/auth/users"),
          api.get("/store")
        ]);
      setProducts(productResponse.data);
      setOrders(orderResponse.data);
      setStats(statsResponse.data);
      setUsers(userResponse.data);
      setConfig(configResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load dashboard");
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  function openForm(product = null) {
    setEditing(product?._id || "new");
    setForm(product ? { ...product } : emptyProduct);
  }
  async function save(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      discount: Number(form.discount),
      stockCount: Number(form.stockCount),
      rating: Number(form.rating),
      sizes: Array.isArray(form.sizes) ? form.sizes : form.sizes.split(",").map((item) => item.trim()).filter(Boolean)
    };
    try {
      editing === "new" ? await api.post("/products", payload) : await api.put(`/products/${editing}`, payload);
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save product");
    }
  }
  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  }
  async function status(id, nextStatus) {
    await api.patch(`/orders/${id}/status`, { status: nextStatus });
    load();
  }
  async function saveStoreConfig(event) {
    event.preventDefault();
    try {
      await api.put("/store", {
        bannerURL: config.bannerURL,
        categories: Array.isArray(config.categories)
          ? config.categories
          : config.categories.split(",").map((item) => item.trim()).filter(Boolean)
      });
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update storefront");
    }
  }

  return (
    <div className="container-page py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-coral">Operations</p><h1 className="mt-2 font-display text-5xl font-bold">Admin dashboard</h1></div><button onClick={() => openForm()} className="btn-primary gap-2"><Plus size={18} /> Add product</button></div>
      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[[Users, "Users", stats.users], [Package, "Products", stats.products], [ShoppingCart, "Orders", stats.orders], [WalletCards, "Paid revenue", money(stats.revenue)]].map(([Icon, label, value]) => <div key={label} className="card flex items-center gap-4 p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-forest"><Icon /></span><div><p className="text-sm text-stone-500">{label}</p><p className="text-2xl font-bold">{value}</p></div></div>)}</div>
      <form onSubmit={saveStoreConfig} className="card mt-6 grid gap-4 p-6 lg:grid-cols-[auto_1fr_1fr_auto] lg:items-end"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-forest"><Image /></span><label className="text-sm font-bold">Home banner URL<input required type="url" className="field mt-2" value={config.bannerURL || ""} onChange={(e) => setConfig({ ...config, bannerURL: e.target.value })} /></label><label className="text-sm font-bold">Categories<input className="field mt-2" value={Array.isArray(config.categories) ? config.categories.join(", ") : config.categories} onChange={(e) => setConfig({ ...config, categories: e.target.value })} placeholder="Mobiles, Fashion, Groceries" /></label><button className="btn-primary">Update storefront</button></form>
      <div className="mt-8 flex gap-2 overflow-x-auto border-b"><button onClick={() => setTab("products")} className={`px-5 py-3 font-bold ${tab === "products" ? "border-b-2 border-forest text-forest" : "text-stone-400"}`}>Products</button><button onClick={() => setTab("orders")} className={`px-5 py-3 font-bold ${tab === "orders" ? "border-b-2 border-forest text-forest" : "text-stone-400"}`}>Orders</button><button onClick={() => setTab("users")} className={`px-5 py-3 font-bold ${tab === "users" ? "border-b-2 border-forest text-forest" : "text-stone-400"}`}>Users</button></div>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        {tab === "products" ? <table className="w-full min-w-[750px] text-left"><thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-t"><td className="p-4"><div className="flex items-center gap-3"><img src={product.imageURL} alt="" className="h-11 w-11 rounded-lg object-cover" /><span className="font-bold">{product.name}</span></div></td><td>{product.category}</td><td>{money(product.price)}{product.discount > 0 && <span className="ml-1 text-xs text-coral">-{product.discount}%</span>}</td><td>{product.stockCount}</td><td className="pr-4 text-right"><button onClick={() => openForm(product)} className="p-2 text-moss"><Edit3 size={18} /></button><button onClick={() => remove(product._id)} className="p-2 text-red-500"><Trash2 size={18} /></button></td></tr>)}</tbody></table> :
          tab === "orders" ? <table className="w-full min-w-[850px] text-left"><thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Order</th><th>Customer</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id} className="border-t"><td className="p-4 font-mono text-sm">#{order._id.slice(-8)}</td><td><p className="font-bold">{order.user?.name}</p><p className="text-xs text-stone-500">{order.user?.email}</p></td><td>{money(order.totalPrice)}</td><td>{order.isPaid ? "Yes" : "No"}</td><td><select className="rounded-lg border px-3 py-2" value={order.status} onChange={(e) => status(order._id, e.target.value)}>{["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((item) => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table> :
          <table className="w-full min-w-[650px] text-left"><thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Customer</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="p-4 font-bold">{user.name}</td><td>{user.email}</td><td>{user.isAdmin ? "Administrator" : "Customer"}</td><td>{new Date(user.createdAt).toLocaleDateString("en-IN")}</td></tr>)}</tbody></table>}
      </div>
      {editing && <div className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-ink/60 p-4"><form onSubmit={save} className="my-8 w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl"><div className="flex justify-between"><h2 className="font-display text-3xl font-bold">{editing === "new" ? "Add product" : "Edit product"}</h2><button type="button" onClick={() => setEditing(null)}><X /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required className="field sm:col-span-2" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><textarea required className="field min-h-28 sm:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><input required type="number" min="0" className="field" placeholder="Sale price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><input type="number" min="0" className="field" placeholder="Original MRP" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} /><input type="number" min="0" max="100" className="field" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /><input required className="field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /><select className="field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Not applicable</option><option>Men</option><option>Women</option><option>Unisex</option></select><input className="field" placeholder="Sizes: S, M, L" value={Array.isArray(form.sizes) ? form.sizes.join(", ") : form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /><input required type="number" min="0" className="field" placeholder="Stock count" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} /><input type="number" min="0" max="5" step=".1" className="field" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /><input required type="url" className="field sm:col-span-2" placeholder="Image URL" value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} /><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured product</label></div><button className="btn-primary mt-7 w-full">Save product</button></form></div>}
    </div>
  );
}

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const search = params.get("search") || "";
  const category = params.get("category") || "all";
  const gender = params.get("gender") || "all";
  const maxPrice = params.get("maxPrice") || "";
  const sort = params.get("sort") || "newest";

  useEffect(() => {
    setLoading(true);
    api.get("/products", { params: { search, category, gender, maxPrice, sort } }).then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, [search, category, gender, maxPrice, sort]);

  useEffect(() => {
    api.get("/products/categories").then(({ data }) => setCategories(data));
  }, []);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value && value !== "all" ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-coral">The collection</p><h1 className="mt-2 font-display text-5xl font-bold">Find something worth keeping.</h1></div>
      <div className="mt-10 grid gap-4 rounded-2xl border bg-white p-4 md:grid-cols-2 xl:grid-cols-[1fr_180px_160px_160px_190px]">
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-stone-50 px-4"><Search size={18} className="text-stone-400" /><input value={search} onChange={(e) => update("search", e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="Search by name or description" /></label>
        <select value={category} onChange={(e) => update("category", e.target.value)} className="field md:w-48"><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={gender} onChange={(e) => update("gender", e.target.value)} className="field"><option value="all">All genders</option><option>Men</option><option>Women</option><option>Unisex</option></select>
        <input type="number" min="0" value={maxPrice} onChange={(e) => update("maxPrice", e.target.value)} className="field" placeholder="Max price ₹" />
        <select value={sort} onChange={(e) => update("sort", e.target.value)} className="field"><option value="newest">Popular / newest</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option><option value="discount">Best discount</option><option value="rating">Top rated</option></select>
      </div>
      {loading ? <Loading /> : products.length ? <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div> : <div className="py-28 text-center"><h2 className="font-display text-3xl font-bold">No products found</h2><p className="mt-2 text-stone-500">Try a different search or category.</p></div>}
    </div>
  );
}

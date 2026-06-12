import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api.get("/products?featured=true").then(({ data }) => setProducts(data)).catch(() => setProducts([]));
    api.get("/store").then(({ data }) => setConfig(data)).catch(() => {});
  }, []);

  return (
    <>
      <section className="overflow-hidden bg-cream">
        <div className="container-page grid min-h-[650px] items-center gap-10 py-14 lg:grid-cols-2">
          <div className="relative z-10">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-coral">The everyday collection</p>
            <h1 className="max-w-xl font-display text-6xl font-bold leading-[0.98] tracking-tight md:text-7xl">Better finds for the way you live.</h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-stone-600">Explore carefully selected tech, fashion, and home essentials. Good design, honest prices, and a checkout that stays out of your way.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link to="/shop" className="btn-primary gap-2">Shop collection <ArrowRight size={18} /></Link><Link to="/shop?category=Electronics" className="btn-secondary">Explore tech</Link></div>
          </div>
          <div className="relative mx-auto h-[500px] w-full max-w-xl">
            <div className="absolute right-0 top-0 h-[440px] w-[82%] overflow-hidden rounded-[4rem] rounded-br-xl bg-moss">
              <img src={config?.bannerURL || "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=85"} alt="ShopEZ collection" className="h-full w-full object-cover mix-blend-luminosity opacity-90" />
            </div>
            <div className="absolute bottom-0 left-0 rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-widest text-moss">New this week</p><p className="mt-1 font-display text-2xl font-bold">Fresh essentials</p><p className="mt-2 text-sm text-stone-500">Designed to earn a place in your day.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-coral">Selected for you</p><h2 className="mt-2 font-display text-4xl font-bold">Featured products</h2></div><Link to="/shop" className="font-semibold text-forest">View all products →</Link></div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}</div>
      </section>

      <section className="container-page">
        <div className="grid gap-5 rounded-[2.5rem] bg-forest p-8 text-white md:grid-cols-3 md:p-12">
          {[["Free delivery", "On orders above ₹2,000", Truck], ["Secure payments", "Protected and encrypted", ShieldCheck], ["Easy returns", "Simple 7-day returns", RefreshCcw]].map(([title, text, Icon]) => (
            <div key={title} className="flex gap-4 rounded-2xl bg-white/5 p-5"><Icon className="shrink-0 text-[#b8d3c4]" /><div><p className="font-bold">{title}</p><p className="mt-1 text-sm text-white/65">{text}</p></div></div>
          ))}
        </div>
      </section>
    </>
  );
}

import { Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Loading from "../components/Loading";
import { addToCart } from "../redux/cartSlice";
import { money } from "../utils/format";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setError("Product not found"));
  }, [id]);

  if (error) return <div className="container-page py-28 text-center"><h1 className="font-display text-4xl">{error}</h1><Link to="/shop" className="btn-primary mt-6">Back to shop</Link></div>;
  if (!product) return <Loading />;

  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-2 lg:py-20">
      <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-stone-100"><img src={product.imageURL} alt={product.name} className="h-full w-full object-cover" /></div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-bold uppercase tracking-widest text-coral">{product.category}</p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-tight">{product.name}</h1>
        <div className="mt-5 flex items-center gap-2 text-stone-500"><Star size={18} className="text-coral" fill="currentColor" /><span>{product.rating} customer rating</span></div>
        <p className="mt-6 text-3xl font-bold text-forest">{money(product.price)}</p>
        {product.originalPrice > product.price && <p className="mt-1 text-stone-400"><span className="line-through">{money(product.originalPrice)}</span> <span className="ml-2 font-bold text-coral">{product.discount}% off</span></p>}
        <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">{product.description}</p>
        {product.sizes?.length > 0 && <label className="mt-6 max-w-xs text-sm font-bold">Choose size<select required value={size} onChange={(e) => setSize(e.target.value)} className="field mt-2"><option value="">Select a size</option>{product.sizes.map((item) => <option key={item}>{item}</option>)}</select></label>}
        <p className={`mt-6 text-sm font-semibold ${product.stockCount ? "text-moss" : "text-red-600"}`}>{product.stockCount ? `${product.stockCount} available` : "Out of stock"}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex items-center rounded-full border bg-white"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={18} /></button><span className="w-10 text-center font-bold">{quantity}</span><button onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))} className="p-3"><Plus size={18} /></button></div>
          <button disabled={!product.stockCount || (product.sizes?.length > 0 && !size)} onClick={() => dispatch(addToCart({ ...product, quantity, selectedSize: size }))} className="btn-primary gap-2"><ShoppingBag size={19} /> Add to cart</button>
        </div>
      </div>
    </div>
  );
}

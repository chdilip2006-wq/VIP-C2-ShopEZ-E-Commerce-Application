import { ShoppingBag, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { money } from "../utils/format";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/product/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-stone-100">
        <img src={product.imageURL} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-moss">
          <span>{product.category}</span>
          <span className="flex items-center gap-1 text-stone-500"><Star size={13} fill="currentColor" /> {product.rating || "New"}</span>
        </div>
        <Link to={`/product/${product._id}`}><h3 className="mt-2 text-lg font-bold">{product.name}</h3></Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-forest">{money(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-stone-400 line-through">{money(product.originalPrice)}</span>
            )}
            {product.discount > 0 && <p className="text-xs font-bold text-coral">{product.discount}% off</p>}
          </div>
          <button disabled={!product.stockCount} onClick={() => dispatch(addToCart(product))} className="grid h-10 w-10 place-items-center rounded-full bg-cream text-forest transition hover:bg-forest hover:text-white disabled:opacity-40" title="Add to cart"><ShoppingBag size={18} /></button>
        </div>
      </div>
    </article>
  );
}

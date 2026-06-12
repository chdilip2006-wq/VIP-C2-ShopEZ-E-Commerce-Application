import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { money } from "../utils/format";

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!items.length) return <div className="container-page py-28 text-center"><h1 className="font-display text-5xl font-bold">Your bag is waiting.</h1><p className="mt-3 text-stone-500">Add a few excellent things to get started.</p><Link to="/shop" className="btn-primary mt-8">Explore products</Link></div>;

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-5xl font-bold">Shopping bag</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">{items.map((item) => (
          <div key={item._id} className="card flex gap-4 p-4 sm:gap-6">
            <img src={item.imageURL} alt={item.name} className="h-28 w-24 rounded-2xl object-cover sm:h-36 sm:w-32" />
              <div className="flex flex-1 flex-col"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-moss">{item.category}</p><Link to={`/product/${item._id}`} className="mt-1 block text-lg font-bold">{item.name}</Link></div><button onClick={() => dispatch(removeFromCart(item._id))} className="self-start p-2 text-stone-400 hover:text-red-600"><Trash2 size={19} /></button></div>
              {item.selectedSize && <p className="mt-1 text-sm text-stone-500">Size: {item.selectedSize}</p>}
              <div className="mt-auto flex items-end justify-between"><div className="flex items-center rounded-full border"><button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))} className="p-2"><Minus size={15} /></button><span className="w-8 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} className="p-2"><Plus size={15} /></button></div><span className="font-bold text-forest">{money(item.price * item.quantity)}</span></div>
            </div>
          </div>
        ))}</div>
        <aside className="card h-fit p-7"><h2 className="font-display text-2xl font-bold">Order summary</h2><div className="mt-6 space-y-4 text-stone-600"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{subtotal >= 2000 ? "Free" : money(199)}</span></div></div><div className="my-6 border-t" /><div className="flex justify-between text-xl font-bold"><span>Total</span><span>{money(subtotal + (subtotal >= 2000 ? 0 : 199))}</span></div><Link to="/checkout" className="btn-primary mt-7 w-full">Proceed to checkout</Link><Link to="/shop" className="mt-4 block text-center text-sm font-semibold text-forest">Continue shopping</Link></aside>
      </div>
    </div>
  );
}

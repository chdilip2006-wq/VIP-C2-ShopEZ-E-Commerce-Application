import { CheckCircle2, CreditCard } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import api from "../api";
import { clearCart } from "../redux/cartSlice";
import { money } from "../utils/format";

export default function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    mobile: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India"
  });
  const [paymentMethod, setPaymentMethod] = useState("Demo card payment");
  const [specificRequirements, setSpecificRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const dispatch = useDispatch();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (subtotal >= 2000 ? 0 : 199);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const orderItems = items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        size: item.selectedSize
      }));
      const cashOnDelivery = paymentMethod === "Cash on delivery";
      let paymentId = "cash_on_delivery";
      if (!cashOnDelivery) {
        const payment = await api.post("/payment/process", { items: orderItems });
        if (payment.data.clientSecret) {
          throw new Error("Stripe Elements must confirm the configured live payment before order creation.");
        }
        paymentId = payment.data.paymentId;
      }
      await api.post("/orders", {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        specificRequirements,
        paymentId,
        isPaid: !cashOnDelivery
      });
      dispatch(clearCart());
      setComplete(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!items.length && !complete) return <Navigate to="/cart" replace />;
  if (complete) return <div className="container-page grid min-h-[600px] place-items-center py-16"><div className="max-w-lg text-center"><CheckCircle2 size={70} className="mx-auto text-moss" /><h1 className="mt-5 font-display text-5xl font-bold">Order confirmed.</h1><p className="mt-4 text-stone-600">Thank you. Your order is now being prepared and can be tracked from your profile.</p><Link to="/profile" className="btn-primary mt-8">View order details</Link></div></div>;

  return (
    <div className="container-page py-12"><h1 className="font-display text-5xl font-bold">Checkout</h1>
      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="card p-7 md:p-9"><h2 className="font-display text-2xl font-bold">Checkout details</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required className="field sm:col-span-2" placeholder="Full name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} /><input required type="tel" className="field" placeholder="Mobile number" value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value })} /><input required type="email" className="field" placeholder="Email address" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} /><input required className="field sm:col-span-2" placeholder="Street address" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} /><input required className="field" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /><input required className="field" placeholder="Postal code" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} /><input required className="field sm:col-span-2" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} /><select className="field sm:col-span-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option>Demo card payment</option><option>Cash on delivery</option><option>Net banking</option><option>UPI</option></select><textarea className="field min-h-24 sm:col-span-2" placeholder="Specific product or delivery requirements (optional)" value={specificRequirements} onChange={(e) => setSpecificRequirements(e.target.value)} /></div>
          <div className="mt-8 rounded-2xl bg-cream p-5"><div className="flex items-center gap-3"><CreditCard className="text-forest" /><div><p className="font-bold">Secure demo payment</p><p className="text-sm text-stone-500">Configure Stripe in the server environment to enable live payments.</p></div></div></div>
        </section>
        <aside className="card h-fit p-7"><h2 className="font-display text-2xl font-bold">Your order</h2><div className="mt-5 max-h-60 space-y-4 overflow-auto">{items.map((item) => <div className="flex gap-3" key={item._id}><img className="h-14 w-14 rounded-xl object-cover" src={item.imageURL} alt="" /><div className="flex-1"><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-stone-500">Qty {item.quantity}</p></div><span className="text-sm font-semibold">{money(item.price * item.quantity)}</span></div>)}</div><div className="my-5 border-t" /><div className="flex justify-between text-xl font-bold"><span>Total</span><span>{money(total)}</span></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="btn-primary mt-6 w-full">{loading ? "Processing..." : `Pay ${money(total)}`}</button></aside>
      </form>
    </div>
  );
}

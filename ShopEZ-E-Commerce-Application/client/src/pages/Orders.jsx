import { PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import Loading from "../components/Loading";
import { money } from "../utils/format";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const loadOrders = () => api.get("/orders/mine").then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  useEffect(() => { loadOrders(); }, []);
  async function cancelOrder(id) {
    if (!window.confirm("Cancel this order?")) return;
    await api.patch(`/orders/${id}/cancel`);
    loadOrders();
  }
  if (!orders) return <Loading />;

  return (
    <div className="container-page py-12"><p className="text-sm font-bold uppercase tracking-widest text-coral">Your account</p><h1 className="mt-2 font-display text-5xl font-bold">Profile & orders</h1>
      <div className="mt-10 grid gap-7 lg:grid-cols-[280px_1fr]"><aside className="card h-fit p-6"><p className="text-xs font-bold uppercase tracking-wider text-moss">Account details</p><h2 className="mt-3 text-xl font-bold">{user?.name}</h2><p className="mt-1 break-all text-sm text-stone-500">{user?.email}</p><div className="my-5 border-t" /><p className="text-sm text-stone-500">Orders placed</p><p className="text-3xl font-bold text-forest">{orders.length}</p></aside>
      {!orders.length ? <div className="py-20 text-center"><PackageCheck size={55} className="mx-auto text-moss" /><h2 className="mt-4 font-display text-3xl font-bold">No orders yet</h2></div> :
        <div className="space-y-5">{orders.map((order) => <article key={order._id} className="card p-6"><div className="flex flex-wrap justify-between gap-4 border-b pb-5"><div><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Order #{order._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })} · {order.paymentMethod}</p><p className="mt-1 text-sm text-stone-500">{order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p></div><div className="text-right"><span className="rounded-full bg-cream px-3 py-1 text-sm font-bold text-forest">{order.status}</span><p className="mt-2 font-bold">{money(order.totalPrice)}</p></div></div><div className="mt-5 flex flex-wrap gap-3">{order.orderItems.map((item) => <div key={`${item.product}-${item.size || ""}`} className="flex items-center gap-3 rounded-xl bg-stone-50 p-2 pr-4"><img src={item.imageURL} alt="" className="h-12 w-12 rounded-lg object-cover" /><div><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-stone-500">Quantity {item.quantity}{item.size ? ` · Size ${item.size}` : ""}</p></div></div>)}</div>{["Pending", "Processing"].includes(order.status) && <button onClick={() => cancelOrder(order._id)} className="mt-5 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Cancel order</button>}</article>)}</div>}
      </div>
    </div>
  );
}

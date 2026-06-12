import { LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition hover:text-forest ${isActive ? "text-forest" : "text-stone-600"}`;

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(search)}`);
    setOpen(false);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-[#fbfaf7]/95 backdrop-blur">
        <div className="container-page flex h-20 items-center gap-6">
          <Link to="/" className="font-display text-3xl font-bold tracking-tight text-forest">ShopEZ.</Link>
          <nav className="hidden items-center gap-7 md:flex">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/shop" className={navClass}>Shop</NavLink>
            {user && <NavLink to="/profile" className={navClass}>Profile</NavLink>}
            {user?.isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
          </nav>
          <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 items-center rounded-full bg-white px-4 shadow-sm lg:flex">
            <Search size={18} className="text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="w-full bg-transparent px-3 py-2.5 outline-none" />
          </form>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {user ? (
              <button onClick={() => dispatch(logout())} title="Log out" className="rounded-full p-2.5 hover:bg-stone-100"><LogOut size={20} /></button>
            ) : (
              <Link to="/login" title="Account" className="rounded-full p-2.5 hover:bg-stone-100"><UserRound size={20} /></Link>
            )}
            <Link to="/cart" className="relative rounded-full p-2.5 hover:bg-stone-100">
              <ShoppingBag size={21} />
              {count > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-xs font-bold text-white">{count}</span>}
            </Link>
            <button onClick={() => setOpen(!open)} className="rounded-full p-2.5 md:hidden">{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <div className="container-page space-y-4 border-t py-5 md:hidden">
            <form onSubmit={submitSearch} className="flex rounded-xl border bg-white px-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="w-full py-3 outline-none" /></form>
            <Link to="/" onClick={() => setOpen(false)} className="block">Home</Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="block">Shop</Link>
            {user && <Link to="/profile" onClick={() => setOpen(false)} className="block">Profile & orders</Link>}
            {user?.isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block">Admin dashboard</Link>}
          </div>
        )}
      </header>
      <main><Outlet /></main>
      <footer className="mt-20 bg-ink py-12 text-stone-300">
        <div className="container-page grid gap-8 md:grid-cols-3">
          <div><p className="font-display text-3xl font-bold text-white">ShopEZ.</p><p className="mt-3 max-w-sm text-sm">Thoughtful products, straightforward shopping, and secure checkout in one modern marketplace.</p></div>
          <div><p className="font-semibold text-white">Explore</p><div className="mt-3 space-y-2 text-sm"><Link className="block" to="/shop">All products</Link><Link className="block" to="/profile">Track orders</Link></div></div>
          <div><p className="font-semibold text-white">Customer care</p><p className="mt-3 text-sm">support@shopez.com</p><p className="mt-1 text-sm">Mon-Sat, 9:00-18:00</p></div>
        </div>
      </footer>
    </div>
  );
}

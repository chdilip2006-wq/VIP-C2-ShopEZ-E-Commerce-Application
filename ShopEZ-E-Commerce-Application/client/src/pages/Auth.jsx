import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, loginUser, registerUser } from "../redux/authSlice";

export default function Auth({ register = false }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, register]);
  useEffect(() => {
    if (token) navigate(location.state?.from || "/", { replace: true });
  }, [token, navigate, location.state]);

  const submit = (event) => {
    event.preventDefault();
    dispatch(register ? registerUser(form) : loginUser({ email: form.email, password: form.password }));
  };

  return (
    <div className="container-page grid min-h-[650px] place-items-center py-12">
      <div className="card w-full max-w-md p-8 md:p-10"><p className="text-sm font-bold uppercase tracking-widest text-coral">{register ? "Join ShopEZ" : "Welcome back"}</p><h1 className="mt-2 font-display text-4xl font-bold">{register ? "Create your account" : "Sign in to continue"}</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">{register && <input className="field" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}<input className="field" type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input className="field" type="password" minLength={6} placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="btn-primary w-full">{loading ? "Please wait..." : register ? "Create account" : "Sign in"}</button></form>
        <p className="mt-6 text-center text-sm text-stone-500">{register ? "Already have an account?" : "New to ShopEZ?"} <Link className="font-bold text-forest" to={register ? "/login" : "/register"}>{register ? "Sign in" : "Create an account"}</Link></p>
      </div>
    </div>
  );
}

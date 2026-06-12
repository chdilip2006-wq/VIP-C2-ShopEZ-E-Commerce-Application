import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="container-page py-28 text-center"><p className="text-sm font-bold uppercase tracking-widest text-coral">404</p><h1 className="mt-3 font-display text-6xl font-bold">Page not found.</h1><Link to="/" className="btn-primary mt-8">Return home</Link></div>;
}

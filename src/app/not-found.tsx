import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="font-heading font-black text-6xl text-slate-900 mb-4">404</h1>
      <h2 className="font-heading font-bold text-xl text-slate-800 mb-6">Page Not Found</h2>
      <p className="text-slate-600 text-sm max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#090D16] hover:bg-[#FF6700] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
      >
        <span>Back to Home</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

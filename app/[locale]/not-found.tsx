import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="text-5xl font-extrabold">
        4<span className="text-gradient">0</span>4
      </div>
      <p className="mt-3 text-muted">Page not found.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary-bright"
      >
        ← Home
      </Link>
    </div>
  );
}

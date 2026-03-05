"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: "Men" | "Women";
  price: string;
  compareAtPrice?: string;
  tag?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  image: string;
};

type CartItem = {
  productId: number;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "Men",
    price: "$29.99",
    tag: "Bestseller",
    image: "/window.svg",
  },
  {
    id: 2,
    name: "Slim Fit Denim",
    category: "Men",
    price: "$49.99",
    compareAtPrice: "$59.99",
    isOnSale: true,
    tag: "Sale",
    image: "/globe.svg",
  },
  {
    id: 3,
    name: "Linen Summer Shirt",
    category: "Men",
    price: "$39.99",
    tag: "New",
    isNew: true,
    image: "/file.svg",
  },
  {
    id: 4,
    name: "Everyday Blouse",
    category: "Women",
    price: "$34.99",
    image: "/next.svg",
  },
  {
    id: 5,
    name: "High-Waist Trousers",
    category: "Women",
    price: "$64.99",
    tag: "Trending",
    image: "/vercel.svg",
  },
  {
    id: 6,
    name: "Relaxed Hoodie",
    category: "Women",
    price: "$39.99",
    compareAtPrice: "$49.99",
    isOnSale: true,
    tag: "Sale",
    image: "/window.svg",
  },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Men" | "Women" | "New" | "Sale"
  >("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const productsRef = useRef<HTMLElement | null>(null);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case "Men":
        return products.filter((p) => p.category === "Men");
      case "Women":
        return products.filter((p) => p.category === "Women");
      case "New":
        return products.filter((p) => p.isNew);
      case "Sale":
        return products.filter((p) => p.isOnSale);
      case "All":
      default:
        return products;
    }
  }, [activeFilter]);

  const goToProducts = (next: typeof activeFilter) => {
    setActiveFilter(next);
    // Wait a tick so UI updates before scrolling.
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const addToCart = (productId: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (!existing) {
        return [...current, { productId, quantity: 1 }];
      }
      return current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        {/* Header / Navbar */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-900 sm:h-10 sm:w-10">
              EC
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight sm:text-base">
                Ecom Couture
              </p>
              <p className="text-xs text-slate-400 sm:text-[13px]">
                Modern clothing for men & women
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 text-sm md:flex">
            <button
              type="button"
              onClick={() => goToProducts("Men")}
              className={[
                "rounded-full px-3 py-1.5 transition",
                activeFilter === "Men"
                  ? "bg-white/10 text-white ring-1 ring-white/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => goToProducts("Women")}
              className={[
                "rounded-full px-3 py-1.5 transition",
                activeFilter === "Women"
                  ? "bg-white/10 text-white ring-1 ring-white/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              Women
            </button>
            <button
              type="button"
              onClick={() => goToProducts("New")}
              className={[
                "rounded-full px-3 py-1.5 transition",
                activeFilter === "New"
                  ? "bg-white/10 text-white ring-1 ring-white/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => goToProducts("Sale")}
              className={[
                "rounded-full px-3 py-1.5 transition",
                activeFilter === "Sale"
                  ? "bg-white/10 text-white ring-1 ring-white/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              Sale
            </button>
          </nav>

          <button className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm backdrop-blur-sm transition hover:border-white/40 hover:bg-white/5 sm:px-4 sm:text-sm">
            <span>Cart</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[11px] font-semibold text-slate-950">
              {cartCount}
            </span>
          </button>
        </header>

        {/* Hero */}
        <section className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5 sm:space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 sm:text-[13px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Fresh drop: Summer 2026 collection
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Effortless style for
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {" "}
                every wardrobe
              </span>
              .
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Discover hand-picked essentials for men and women. Clean lines,
              soft fabrics, and silhouettes that move with you from weekday to
              weekend.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => goToProducts("All")}
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300 sm:px-6 sm:py-2.5"
              >
                Shop the collection
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-white/50 hover:bg-white/5 sm:px-5 sm:text-sm">
                View lookbook
              </button>
              <p className="flex items-center gap-2 text-xs text-slate-400 sm:text-[13px]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px]">
                  ✓
                </span>
                Free shipping over $75
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-5 shadow-xl sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]" />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-300">
                    Today&apos;s pick
                  </p>
                  <p className="text-sm font-semibold text-slate-50">
                    Lightweight Linen Shirt
                  </p>
                </div>
                <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
                  -20% off
                </span>
              </div>
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
                <Image
                  src="/window.svg"
                  alt="Featured clothing"
                  fill
                  className="object-cover object-center opacity-90"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div>
                  <p className="font-medium text-slate-100">Men&apos;s Linen</p>
                  <p className="text-[11px] text-slate-400">
                    Available in 4 colors
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-300">
                    $39.99
                  </p>
                  <p className="text-[11px] text-slate-500 line-through">
                    $49.99
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section
          ref={(el) => {
            productsRef.current = el;
          }}
          className="mt-10 scroll-mt-24 space-y-4 sm:mt-12"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Featured styles
              </h2>
              <p className="text-xs text-slate-400 sm:text-sm">
                Curated picks for men and women. All items are for demo only.
              </p>
            </div>
            <div className="inline-flex gap-1 rounded-full bg-slate-900/80 p-1 text-xs text-slate-300 ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className={[
                  "rounded-full px-3 py-1 font-medium transition",
                  activeFilter === "All"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Men")}
                className={[
                  "rounded-full px-3 py-1 font-medium transition",
                  activeFilter === "Men"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                Men
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Women")}
                className={[
                  "rounded-full px-3 py-1 font-medium transition",
                  activeFilter === "Women"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                Women
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("New")}
                className={[
                  "rounded-full px-3 py-1 font-medium transition",
                  activeFilter === "New"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Sale")}
                className={[
                  "rounded-full px-3 py-1 font-medium transition",
                  activeFilter === "Sale"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                Sale
              </button>
            </div>
          </div>

          <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-lg sm:p-4"
              >
                <div className="relative mb-3 overflow-hidden rounded-xl border border-white/5 bg-slate-900">
                  <div className="relative h-40 w-full sm:h-44">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-6 opacity-90 transition group-hover:scale-105"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute left-2 top-2 flex flex-col gap-1">
                    <span className="inline-flex rounded-full bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-slate-100 ring-1 ring-white/15">
                      {product.category}
                    </span>
                    {product.tag && (
                      <span className="inline-flex rounded-full bg-emerald-400 px-2 py-1 text-[11px] font-semibold text-slate-950 shadow-sm">
                        {product.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-sm font-semibold text-slate-50 sm:text-[15px]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Soft-touch cotton blend, tailored fit, and everyday comfort
                    built in.
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-emerald-300">
                        {product.price}
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-[11px] text-slate-500 line-through">
                          {product.compareAtPrice}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition group-hover:bg-emerald-300"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500 sm:mt-12 sm:pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Ecom Couture. Demo store only.</p>
            <p className="text-[11px] text-slate-600">
              Built with Next.js and Tailwind CSS.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

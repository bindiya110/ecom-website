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

type CartLine = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "Men",
    price: "$29.99",
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  },
  {
    id: 2,
    name: "Slim Fit Denim",
    category: "Men",
    price: "$49.99",
    compareAtPrice: "$59.99",
    isOnSale: true,
    tag: "Sale",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
  },
  {
    id: 3,
    name: "Linen Summer Shirt",
    category: "Men",
    price: "$39.99",
    tag: "New",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  },
  {
    id: 4,
    name: "Everyday Blouse",
    category: "Women",
    price: "$34.99",
    image:
      "https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?w=800&q=80",
  },
  {
    id: 5,
    name: "High-Waist Trousers",
    category: "Women",
    price: "$64.99",
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  },
  {
    id: 6,
    name: "Relaxed Hoodie",
    category: "Women",
    price: "$39.99",
    compareAtPrice: "$49.99",
    isOnSale: true,
    tag: "Sale",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
  },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Men" | "Women" | "New" | "Sale"
  >("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartView, setCartView] = useState<"cart" | "checkout" | "success">(
    "cart",
  );
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const productsRef = useRef<HTMLElement | null>(null);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const cartLines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity } satisfies CartLine;
      })
      .filter((line): line is CartLine => line !== null);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, line) => {
      const numeric = Number.parseFloat(
        line.product.price.replace("$", "").trim(),
      );
      return sum + (Number.isFinite(numeric) ? numeric : 0) * line.quantity;
    }, 0);
  }, [cartLines]);

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
    setIsCartOpen(true);
    setCartView("cart");
  };

  const decrementFromCart = (productId: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (!existing) return current;
      if (existing.quantity <= 1) {
        return current.filter((item) => item.productId !== productId);
      }
      return current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const startCheckout = () => {
    if (cartLines.length === 0) return;
    setCartView("checkout");
  };

  const placeOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo checkout: clear cart and show confirmation.
    clearCart();
    setCartView("success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        {/* Header / Navbar */}
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white sm:h-10 sm:w-10">
              EC
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight sm:text-base">
                Ecom Couture
              </p>
              <p className="text-xs text-zinc-500 sm:text-[13px]">
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
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
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
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
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
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
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
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
              ].join(" ")}
            >
              Sale
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm backdrop-blur-sm transition hover:border-zinc-400 hover:bg-white sm:px-4 sm:text-sm"
          >
            <span>Cart</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-semibold text-white">
              {cartCount}
            </span>
          </button>
        </header>

        {/* Cart drawer */}
        {isCartOpen ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => {
                setIsCartOpen(false);
                setCartView("cart");
              }}
              className="absolute inset-0 bg-black/30"
            />
            <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-hidden bg-white shadow-2xl ring-1 ring-zinc-200">
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between border-b border-zinc-200 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {cartView === "checkout"
                        ? "Checkout"
                        : cartView === "success"
                          ? "Order placed"
                          : "Your cart"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {cartView === "success"
                        ? "Thanks for your purchase (demo)."
                        : `${cartCount} item${cartCount === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCartView("cart");
                    }}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 overflow-auto px-4 py-4">
                  {cartView === "success" ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                        <p className="font-semibold">Order confirmed.</p>
                        <p className="mt-1 text-emerald-800">
                          This is a demo checkout. No payment was processed.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          setCartView("cart");
                        }}
                        className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800"
                      >
                        Continue shopping
                      </button>
                    </div>
                  ) : cartView === "checkout" ? (
                    <form onSubmit={placeOrder} className="space-y-4">
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-medium text-zinc-700">Subtotal</p>
                          <p className="font-semibold text-zinc-900">
                            ${subtotal.toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          Taxes and shipping are skipped in this demo.
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <label className="grid gap-1 text-xs font-medium text-zinc-700">
                          Full name
                          <input
                            value={checkoutForm.fullName}
                            onChange={(e) =>
                              setCheckoutForm((s) => ({
                                ...s,
                                fullName: e.target.value,
                              }))
                            }
                            required
                            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none ring-emerald-400/40 transition focus:ring-4"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-zinc-700">
                          Email
                          <input
                            type="email"
                            value={checkoutForm.email}
                            onChange={(e) =>
                              setCheckoutForm((s) => ({
                                ...s,
                                email: e.target.value,
                              }))
                            }
                            required
                            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none ring-emerald-400/40 transition focus:ring-4"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-zinc-700">
                          Address
                          <input
                            value={checkoutForm.address}
                            onChange={(e) =>
                              setCheckoutForm((s) => ({
                                ...s,
                                address: e.target.value,
                              }))
                            }
                            required
                            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none ring-emerald-400/40 transition focus:ring-4"
                          />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="grid gap-1 text-xs font-medium text-zinc-700">
                            City
                            <input
                              value={checkoutForm.city}
                              onChange={(e) =>
                                setCheckoutForm((s) => ({
                                  ...s,
                                  city: e.target.value,
                                }))
                              }
                              required
                              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none ring-emerald-400/40 transition focus:ring-4"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium text-zinc-700">
                            Postal code
                            <input
                              value={checkoutForm.postalCode}
                              onChange={(e) =>
                                setCheckoutForm((s) => ({
                                  ...s,
                                  postalCode: e.target.value,
                                }))
                              }
                              required
                              className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none ring-emerald-400/40 transition focus:ring-4"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCartView("cart")}
                          className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                        >
                          Place order
                        </button>
                      </div>
                    </form>
                  ) : cartLines.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                      Your cart is empty. Add some items to get started.
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {cartLines.map((line) => (
                        <li
                          key={line.product.id}
                          className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                            <Image
                              src={line.product.image}
                              alt={line.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-zinc-900">
                                  {line.product.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {line.product.category}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-zinc-900">
                                {line.product.price}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white">
                                <button
                                  type="button"
                                  onClick={() => decrementFromCart(line.product.id)}
                                  className="px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="min-w-10 px-2 text-center text-xs font-semibold text-zinc-900">
                                  {line.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(line.product.id)}
                                  className="px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(line.product.id)}
                                className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border-t border-zinc-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-zinc-700">Subtotal</p>
                    <p className="font-semibold text-zinc-900">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Taxes and shipping calculated at checkout (demo).
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={clearCart}
                      disabled={cartLines.length === 0}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={startCheckout}
                      disabled={cartLines.length === 0}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        {/* Hero */}
        <section className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5 sm:space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:text-[13px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Fresh drop: Summer 2026 collection
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Effortless style for
              <span className="bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">
                {" "}
                every wardrobe
              </span>
              .
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
              Discover hand-picked essentials for men and women. Clean lines,
              soft fabrics, and silhouettes that move with you from weekday to
              weekend.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => goToProducts("All")}
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 sm:px-6 sm:py-2.5"
              >
                Shop the collection
              </button>
              <button
                type="button"
                onClick={() => goToProducts("New")}
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-900 transition hover:border-zinc-400 hover:bg-white sm:px-5 sm:text-sm"
              >
                View lookbook
              </button>
              <p className="flex items-center gap-2 text-xs text-zinc-500 sm:text-[13px]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
                  ✓
                </span>
                Free shipping over $75
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.14),_transparent_55%)]" />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-zinc-600">
                    Today&apos;s pick
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">
                    Lightweight Linen Shirt
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  -20% off
                </span>
              </div>
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                <Image
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
                  alt="Featured clothing"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <div>
                  <p className="font-medium text-zinc-900">Men&apos;s Linen</p>
                  <p className="text-[11px] text-zinc-500">
                    Available in 4 colors
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-700">
                    $39.99
                  </p>
                  <p className="text-[11px] text-zinc-400 line-through">
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
              <p className="text-xs text-zinc-600 sm:text-sm">
                Curated picks for men and women. All items are for demo only.
              </p>
            </div>
            <div className="inline-flex gap-1 rounded-full bg-zinc-100 p-1 text-xs text-zinc-700 ring-1 ring-zinc-200">
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className={[
                  "rounded-full px-3 py-1 font-medium transition",
                  activeFilter === "All"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-white hover:text-zinc-900",
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
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-white hover:text-zinc-900",
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
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-white hover:text-zinc-900",
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
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-white hover:text-zinc-900",
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
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-white hover:text-zinc-900",
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-md sm:p-4"
              >
                <div className="relative mb-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="relative h-40 w-full sm:h-44">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-6 transition group-hover:scale-105"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute left-2 top-2 flex flex-col gap-1">
                    <span className="inline-flex rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-zinc-900 ring-1 ring-zinc-200">
                      {product.category}
                    </span>
                    {product.tag && (
                      <span className="inline-flex rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                        {product.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 sm:text-[15px]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Soft-touch cotton blend, tailored fit, and everyday comfort
                    built in.
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-emerald-700">
                        {product.price}
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-[11px] text-zinc-400 line-through">
                          {product.compareAtPrice}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 group-hover:bg-emerald-600"
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
        <footer className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:mt-12 sm:pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Ecom Couture. Demo store only.</p>
            <p className="text-[11px] text-zinc-500">
              Built with Next.js and Tailwind CSS.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

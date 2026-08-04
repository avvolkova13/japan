"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CART_KEY = "kanso-cart";

function readCartCount() {
  try {
    const ids = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(ids) ? ids.length : 0;
  } catch {
    return 0;
  }
}

export function CartNavLink({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const syncCount = () => setCount(readCartCount());
    syncCount();
    window.addEventListener("storage", syncCount);
    window.addEventListener("kanso-cart-change", syncCount);
    return () => {
      window.removeEventListener("storage", syncCount);
      window.removeEventListener("kanso-cart-change", syncCount);
    };
  }, []);

  return (
    <Link className={className} href="/cart" aria-label={count ? `Корзина, товаров: ${count}` : "Корзина"}>
      Корзина
      {count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
    </Link>
  );
}

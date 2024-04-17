"use client";

import { Product } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: Product;
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const entry = entries[0];
        if (entry.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoadMore(true);
          const moreProducts = await getMoreProducts(page + 1);
          if (moreProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...moreProducts]);
          } else {
            setIsLastPage(true);
          }

          setIsLoadMore(false);
        }
      },
      {
        threshold: 1
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 gap-5 flex flex-col">
      {products.map((product, index) => (
        <ListProduct key={index} {...product} />
      ))}
      {!isLastPage && (
        <span
          ref={trigger}
          className=" text-white bg-orange-400 mx-auto py-2 px-3 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoadMore ? "로딩중" : "더 불러오기"}
        </span>
      )}
    </div>
  );
}

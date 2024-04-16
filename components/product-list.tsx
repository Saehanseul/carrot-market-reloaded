"use client";

import { Product } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: Product;
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const onLoadMoreClick = async () => {
    setIsLoadMore(true);
    const moreProducts = await getMoreProducts(page + 1);
    if (moreProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...moreProducts]);
    } else {
      setIsLastPage(true);
    }

    setIsLoadMore(false);
  };

  return (
    <div className="p-5 gap-5 flex flex-col">
      {products.map((product, index) => (
        <ListProduct key={index} {...product} />
      ))}
      {!isLastPage && (
        <button
          onClick={onLoadMoreClick}
          className="text-white bg-orange-400 mx-auto py-2 px-3 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoadMore ? "로딩중" : "더 불러오기"}
        </button>
      )}
    </div>
  );
}

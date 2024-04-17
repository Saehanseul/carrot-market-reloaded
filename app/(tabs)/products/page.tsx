import { ProductList } from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

const getProducts = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true
    },
    take: 1,
    orderBy: {
      created_at: "desc"
    }
  });

  return products;
};

export type Product = Prisma.PromiseReturnType<typeof getProducts>;

export default async function Products() {
  const initialProducts = await getProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center text-white justify-center rounded-full fixed bottom-24 right-8 size-16 transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}

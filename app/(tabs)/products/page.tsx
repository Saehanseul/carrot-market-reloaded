import { ProductList } from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

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
    </div>
  );
}

import { ProductList } from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getProducts = async () => {
  console.log("getProducts");
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true
    },
    // take: 1,
    orderBy: {
      created_at: "desc"
    }
  });

  return products;
};

const getCachedProducts = nextCache(getProducts, ["home-products"], {
  revalidate: 60
});

export type Product = Prisma.PromiseReturnType<typeof getCachedProducts>;

export const metadata = {
  title: "Home"
};

// export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  const reload = async () => {
    "use server";

    revalidatePath("/home");
  };
  return (
    <div>
      <form action={reload}>
        <button onClick={reload}>reload again</button>
      </form>
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

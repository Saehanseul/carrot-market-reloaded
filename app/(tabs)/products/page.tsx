import ListProduct from "@/components/list-product";
import db from "@/lib/db";

const getProducts = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true
    }
  });

  return products;
};

export default async function Products() {
  const products = await getProducts();
  console.log("products", products);
  return (
    <div className="p-5 gap-5 flex flex-col">
      {products.map((product, index) => (
        <ListProduct key={index} {...product} />
      ))}
    </div>
  );
}

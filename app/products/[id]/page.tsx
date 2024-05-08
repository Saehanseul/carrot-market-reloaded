import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatToWon } from "@/lib/utils";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { createChatRoom } from "./actions";

const getIsOwner = async (userId: number) => {
  // const session = await getSession();
  // if (session.id) {
  //   return session.id === userId;
  // }
  return false;
};

const getProduct = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true
        }
      }
    }
  });

  return product;
};

const getCachedProduct = nextCache(
  (id: number) => getProduct(id),
  ["product-detail"],
  {
    tags: ["product-detail"]
  }
);

const getProductTitle = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id
    },
    select: {
      title: true
    }
  });

  return product;
};

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"]
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductTitle(Number(params.id));
  return {
    title: `${product?.title}`
  };
}

export default async function ProductDetail({
  params
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
  };

  const handleCreateChatRoom = async () => {
    "use server";
    await createChatRoom({
      productUserId: product.userId
    });
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/public`}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <form action={revalidate}>
          <button>리로드</button>
        </form>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToWon(product.price)}원
        </span>
        {isOwner && (
          <Link
            className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
            href={``}
          >
            삭제하기
          </Link>
        )}
        <form action={handleCreateChatRoom}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}

// export const dynamicParams = true

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true
    }
  });
  return products.map((product) => ({
    id: String(product.id)
  }));
}

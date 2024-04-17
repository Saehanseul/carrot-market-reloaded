"use server";
import { z } from "zod";
import fs from "fs/promises";
import { File } from "buffer";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z.string({
    required_error: "사진을 추가해주세요."
  }),
  title: z.string({
    required_error: "제목을 입력해주세요."
  }),
  description: z.string({
    required_error: "설명을 입력해주세요."
  }),
  price: z.coerce.number({
    required_error: "가격을 입력해주세요."
  })
});

export async function UploadProduct(a: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description")
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          photo: result.data.photo,
          title: result.data.title,
          price: result.data.price,
          description: result.data.description,
          user: {
            connect: {
              id: session.id
            }
          }
        },
        select: {
          id: true
        }
      });

      if (product) {
        redirect(`/products/${product.id}`);
      }
    }
  }
}

export const getUploadUrl = async () => {
  console.log("account_id", process.env.CLOUDFLARE_ACCOUNT_ID);
  console.log("token", process.env.CLOUDFLARE_TOKEN);
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`
      }
    }
  );

  const data = await res.json();
  return data;
};

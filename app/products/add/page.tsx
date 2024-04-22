"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useState } from "react";
import { getUploadUrl, UploadProduct } from "./actions";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";
import { revalidatePath } from "next/cache";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema)
  });

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("onImageChange");
    const {
      target: { files }
    } = e;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/vCDlgXFMzUW5bkyF0YNCIw/${id}`
      );
    }
  };
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) return;

    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", file);
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareFormData
    });

    if (res.status !== 200) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", data.photo);
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);

    const errors = await UploadProduct(formData);
    if (errors) {
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  console.log("moonsae errors", errors);
  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5 mb-36">
        <label
          htmlFor="photo"
          className="aspect-square border-2 flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400">
                사진을 추가하세요.{errors.photo?.message}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          {...register("title")}
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          {...register("price")}
          required
          placeholder="가격"
          type="number"
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          {...register("description")}
          required
          placeholder="자세한 설명"
          type="text"
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}

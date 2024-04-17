"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useState } from "react";
import { getUploadUrl, UploadProduct } from "./actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("onImageChange");
    const {
      target: { files }
    } = e;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };
  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
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

    const photoUrl = `https://imagedelivery.net/vCDlgXFMzUW5bkyF0YNCIw/${imageId}`;

    return UploadProduct(_, formData);
  };
  const [state, action] = useFormState(interceptAction, null);
  return (
    <div>
      <form action={action} className="flex flex-col gap-5 p-5 mb-36">
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
              <div className="text-neutral-400">사진을 추가하세요.</div>
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
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}

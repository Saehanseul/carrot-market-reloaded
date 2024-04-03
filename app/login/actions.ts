"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR
} from "@/lib/constants";
import { z } from "zod";

const formDataSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  const validateResult = formDataSchema.safeParse(data);
  if (!validateResult.success) {
    return validateResult.error.flatten();
  } else {
    console.log("login success", validateResult.data);
  }
};

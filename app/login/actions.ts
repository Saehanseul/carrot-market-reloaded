"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bycrypt from "bcrypt";
import loginToProfile from "@/lib/login";

const checkEmailExist = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email
    }
  });
  return !!user;
};

const formDataSchema = z.object({
  email: z
    .string()
    .email()
    .refine(checkEmailExist, "해당 이메일로 가입된 계정이 없습니다."),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export const loginAction = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  const validateResult = await formDataSchema.safeParseAsync(data);
  if (!validateResult.success) {
    return validateResult.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: validateResult.data.email
      },
      select: {
        id: true,
        password: true
      }
    });

    const isPasswordCorrect = await bycrypt.compare(
      validateResult.data.password,
      user!.password ?? ""
    );

    if (isPasswordCorrect) {
      return loginToProfile(user!.id);
    } else {
      return {
        fieldErrors: {
          password: ["비밀번호가 일치하지 않습니다."],
          email: []
        }
      };
    }
  }
};

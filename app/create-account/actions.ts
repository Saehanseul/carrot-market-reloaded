"use server";
import {
  PASSWORD_CONFIRM_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  USERNAME_ERROR
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const checkUsername = (username: string) => {
  return !username.includes(" ");
};

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username
    },
    select: {
      id: true
    }
  });
  return !user;
};

const checkUniqueEmail = async (email: string) => {
  const userEmail = await db.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true
    }
  });
  return !userEmail;
};

const checkPassword = ({
  password,
  confirmPassword
}: {
  password: string;
  confirmPassword: string;
}) => {
  return password === confirmPassword;
};
const formDataSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "문자만 입력해주세요.",
        required_error: "필수 입력사항입니다."
      })
      .refine(checkUsername, USERNAME_ERROR)
      .refine(checkUniqueUsername, "이미 사용중인 이름입니다."),
    email: z
      .string()
      .email()
      .refine(checkUniqueEmail, "이미 사용중인 이메일입니다."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH)
  })
  .refine(checkPassword, {
    message: PASSWORD_CONFIRM_ERROR,
    path: ["confirmPassword"]
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  };

  const validateResult = await formDataSchema.safeParseAsync(data);
  if (!validateResult.success) {
    return validateResult.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(validateResult.data.password, 12);
    const user = await db.user.create({
      data: {
        username: validateResult.data.username,
        email: validateResult.data.email,
        password: hashedPassword
      }
    });
    console.log("user: ", user);
    const cookie = await getIronSession(cookies(), {
      cookieName: "session-carrot",
      password: process.env.COOKIE_PASSWORD!
    });
    cookie.id = user.id;
    await cookie.save();
    redirect("/profile");
  }
};

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
import loginToProfile from "@/lib/login";

const checkUsername = (username: string) => {
  return !username.includes(" ");
};

// const checkUniqueUsername = async (username: string) => {
//   const user = await db.user.findUnique({
//     where: {
//       username
//     },
//     select: {
//       id: true
//     }
//   });
//   return !user;
// };

// const checkUniqueEmail = async (email: string) => {
//   const userEmail = await db.user.findUnique({
//     where: {
//       email: email
//     },
//     select: {
//       id: true
//     }
//   });
//   return !userEmail;
// };

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
      .refine(checkUsername, USERNAME_ERROR),
    email: z.string().email(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH)
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username
      },
      select: {
        id: true
      }
    });
    if (user) {
      console.log("moonsae user", user);
      ctx.addIssue({
        code: "custom",
        message: "해당 유저명으로 가입된 계정이 이미 존재합니다.",
        path: ["username"],
        fatal: true
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email
      },
      select: {
        id: true
      }
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "해당 이메일로 가입된 계정이 이미 존재합니다.",
        path: ["email"],
        fatal: true
      });
      return z.NEVER;
    }
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

    return loginToProfile(user.id);
  }
};

"use server";
import {
  PASSWORD_CONFIRM_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  USERNAME_ERROR
} from "@/lib/constants";
import { z } from "zod";

const checkUsername = (username: string) => {
  return !username.includes(" ");
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
      .refine(checkUsername, USERNAME_ERROR),
    email: z.string().email(),
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
  console.log(data);
  const validateResult = formDataSchema.safeParse(data);
  if (!validateResult.success) {
    return validateResult.error.flatten();
  }
};

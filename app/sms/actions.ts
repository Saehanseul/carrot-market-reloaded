"use server";
import { z } from "zod";
import validator from "validator";
import { PHONE_ERROR, SMS_TOKEN_MAX, SMS_TOKEN_MIN } from "@/lib/constants";
import { redirect } from "next/navigation";

const phoneSchema = z.string().refine(validator.isMobilePhone, PHONE_ERROR);

const tokenSchema = z.coerce.number().min(SMS_TOKEN_MIN).max(SMS_TOKEN_MAX);

interface ActionState {
  token: boolean;
}
export const smsLogin = async (prevState: ActionState, formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten()
      };
    } else {
      return { token: true };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten()
      };
    } else {
      redirect("/");
    }
  }
};

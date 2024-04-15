"use server";

import twilio from "twilio";
import { z } from "zod";
import validator from "validator";
import { PHONE_ERROR, SMS_TOKEN_MAX, SMS_TOKEN_MIN } from "@/lib/constants";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import loginToProfile from "@/lib/login";

const phoneSchema = z.string().refine(validator.isMobilePhone, PHONE_ERROR);

async function tokenExists(token: number) {
  const exist = await db.sMSToken.findUnique({
    where: {
      token: token + ""
    },
    select: {
      id: true
    }
  });
  console.log("moonsae exist", exist);
  return !!exist;
}

const tokenSchema = z.coerce
  .number()
  .min(SMS_TOKEN_MIN)
  .max(SMS_TOKEN_MAX)
  .refine(tokenExists, "토큰이 존재하지 않습니다");

const getToken: () => Promise<any> = async () => {
  const token = crypto.randomInt(SMS_TOKEN_MIN, SMS_TOKEN_MAX).toString();
  const exist = await db.sMSToken.findUnique({
    where: {
      token
    },
    select: {
      id: true
    }
  });

  if (exist) {
    return getToken();
  } else {
    return token;
  }
};

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
      await db.sMSToken.deleteMany({
        where: {
          user: { phone: result.data }
        }
      });
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data
              }
            }
          }
        }
      });
      console.log("result.data", result.data);
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      const sendSMSResult = await client.messages.create({
        body: `인증번호는 ${token} 입니다.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: result.data
      });

      return { token: true };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten()
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data + ""
        },
        select: {
          id: true,
          userId: true
        }
      });

      await db.sMSToken.delete({
        where: {
          id: token!.id
        }
      });
      return loginToProfile(token!.userId);
    }
  }
};

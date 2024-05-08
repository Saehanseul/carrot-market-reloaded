import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

export const getUser = async () => {
  const session = await getSession();
  if (session.id) {
    const user = db.user.findUnique({
      where: {
        id: session.id
      }
    });
    if (user) {
      return user;
    }
  }
  notFound();
};

export const getUserProfile = async () => {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id
    },
    select: {
      username: true,
      avatar: true
    }
  });
  return user;
};

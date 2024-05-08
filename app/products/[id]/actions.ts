"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

interface CreateChatRoomProps {
  productUserId: number;
}

export const createChatRoom = async ({
  productUserId
}: CreateChatRoomProps) => {
  const session = await getSession();
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [
          {
            id: productUserId
          },
          {
            id: session.id
          }
        ]
      }
    },
    select: {
      id: true
    }
  });

  redirect(`/chats/${room.id}`);
};

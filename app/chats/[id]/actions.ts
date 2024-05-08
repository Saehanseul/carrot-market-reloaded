"use server";

import db from "@/lib/db";

export const getRoom = async (roomId: string) => {
  const room = await db.chatRoom.findUnique({
    where: {
      id: roomId
    },
    include: {
      users: {
        select: {
          id: true
        }
      }
    }
  });

  return room;
};

export const getMessages = async (roomId: string) => {
  const messages = await db.message.findMany({
    where: {
      chatRoomId: roomId
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true
        }
      }
    }
  });

  return messages;
};

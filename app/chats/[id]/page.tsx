import getSession from "@/lib/session";
import { getMessages, getRoom } from "./actions";
import { Prisma } from "@prisma/client";
import ChatMessagesList from "@/components/chat-messages-list";
import { getUserProfile } from "@/app/(tabs)/profile/actions";
import { notFound } from "next/navigation";

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }

  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getUserProfile();

  if (!user) {
    notFound();
  }

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      initialMessages={initialMessages}
      username={user.username}
      avatar={user.avatar || null}
    />
  );
}

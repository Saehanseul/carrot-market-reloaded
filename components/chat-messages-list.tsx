"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { sendMessage } from "@/app/chats/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
}

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWhpZ3hmeHZ3eHRzamF3and1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwMzA4NTksImV4cCI6MjAyOTYwNjg1OX0.XZr7H9O2EWnNVPAB6U0Q8QnEJtT-D3z3ptttESMt-qk";
const SUPABASE_URL = "https://vhahigxfxvwxtsjawjwu.supabase.co";

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value }
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessage(message, chatRoomId);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar
        }
      }
    ]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        userId,
        created_at: new Date(),
        user: {
          username,
          avatar
        }
      }
    });

    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        console.log("moonsae payload", payload);
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  const Avatar = ({
    avatar,
    username,
    isMine
  }: {
    avatar: string | null;
    username: string;
    isMine: boolean;
  }) => {
    if (isMine) {
      return;
    }

    return avatar ? (
      <Image
        src={avatar}
        alt={username}
        width={50}
        height={50}
        className="size-8 rounded-full"
      />
    ) : (
      <div className="size-8 rounded-full bg-gray-400" />
    );
  };
  console.log("messages", messages, messages.length);
  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => {
        console.log("message.userId", message.userId);
        console.log("userId", userId);
        return (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              message.userId === userId ? "justify-end" : ""
            }`}
          >
            <Avatar
              avatar={message.user.avatar}
              username={message.user.username}
              isMine={message.userId === userId}
            />
            <div
              className={`flex flex-col gap-1 ${
                message.userId === userId ? "items-end" : ""
              }`}
            >
              <span
                className={`${
                  message.userId === userId ? "bg-gray-400" : "bg-orange-500"
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_at)}
              </span>
            </div>
          </div>
        );
      })}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}

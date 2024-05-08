"use client";

import { dislikePost, likePost } from "@/app/posts/[id]/actions";
import { HandThumbUpIcon as HandThumbUpIconOutLine } from "@heroicons/react/24/outline";
import {
  EyeIcon,
  HandThumbUpIcon as HandThumbUpIconSolid
} from "@heroicons/react/24/solid";
import { useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState, payload) => {
      console.log("prevState", prevState);
      console.log("payload", payload);
      return {
        isLiked: !prevState.isLiked,
        likeCount: prevState.isLiked
          ? prevState.likeCount - 1
          : prevState.likeCount + 1
      };
    }
  );

  const handleOnClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={handleOnClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors ${
        state.isLiked ? "bg-orange-500 text-white border-orange-500" : ""
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIconOutLine className="size-5" />
      ) : (
        <HandThumbUpIconSolid className="size-5" />
      )}
      {state.isLiked ? (
        <span>({state.likeCount})</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}

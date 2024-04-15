import db from "@/lib/db";
import loginToProfile from "@/lib/login";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getCodeFromRequest } from "./functions/get-code";
import { fetchGitHubAccessToken } from "./functions/get-access-token";
import { fetchGitHubUserProfileAndEmails } from "./functions/get-user-info";

export async function GET(request: NextRequest) {
  let code;
  try {
    code = await getCodeFromRequest(request);
  } catch (error: any) {
    return new Response(null, {
      status: 400,
      statusText: error.message
    });
  }

  const { accessToken, error } = await fetchGitHubAccessToken(code);

  if (error || !accessToken) {
    return new Response(null, { status: 400 });
  }

  const {
    login,
    id,
    avatar_url,
    emails,
    error: userProfileError
  } = await fetchGitHubUserProfileAndEmails(accessToken);

  if (userProfileError) {
    // 에러 처리 로직
    return new Response(null, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: {
      github_id: id + ""
    },
    select: {
      id: true
    }
  });

  if (user) {
    return loginToProfile(user.id);
  }

  const isExistUsername = await db.user.findUnique({
    where: {
      username: login!
    },
    select: {
      id: true
    }
  });

  const newUser = await db.user.create({
    data: {
      username: login! + (isExistUsername ? "-gt" : ""),
      github_id: id + "",
      avatar: avatar_url
    }
  });
  return loginToProfile(newUser.id);
}

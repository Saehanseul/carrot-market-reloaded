import { NextRequest } from "next/server";

export async function getCodeFromRequest(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    throw new Error("Code not found"); // 에러를 던지는 방식으로 변경
  }
  return code;
}

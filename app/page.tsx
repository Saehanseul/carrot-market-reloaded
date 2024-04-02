import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-between p-6">
      <div className="my-auto flex flex-col items-center gap-2">
        <span className="text-9xl *:font-medium">🥕</span>
        <h1 className="text-4xl">당근</h1>
        <h2 className="text-2xl">당근 마켓에 어서오세요!</h2>
      </div>
      <div className="flex flex-col w-full items-center gap-3">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          시작하기
        </Link>
        <div>
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className=" hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}

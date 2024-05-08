import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getUser } from "./actions";

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    return redirect("/");
  };
  return (
    <div>
      <h1>Welcome! {user?.username}</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}

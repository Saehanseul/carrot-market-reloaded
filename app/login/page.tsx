"use client";

import SocialLogin from "@/components/social-login";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function LogIn() {
  const [state, action] = useFormState(login, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login with email and password!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          required
          type="email"
          placeholder="Email"
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          required
          type="password"
          placeholder="Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />

        <Button text={"Login"} />
      </form>
      <SocialLogin />
    </div>
  );
}

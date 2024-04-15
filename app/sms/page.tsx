"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";
import { SMS_TOKEN_MAX, SMS_TOKEN_MIN } from "@/lib/constants";

const initialState = {
  token: false,
  error: undefined
};
export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            required
            type="number"
            placeholder="Verification code"
            min={SMS_TOKEN_MIN}
            max={SMS_TOKEN_MAX}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name="phone"
            required
            type="text"
            placeholder="Phone number"
            errors={state.error?.formErrors}
          />
        )}

        <Button
          text={state.token ? "Verify Token" : "Send verification sms."}
        />
      </form>
    </div>
  );
}

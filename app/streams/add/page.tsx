"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startStream } from "./action";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);

  return (
    <form className="p-5" action={action}>
      <Input
        name="title"
        placeholder="Title of your stream"
        errors={state?.formErrors}
        required
      />
      <Button text="Start streaming!" />
    </form>
  );
}

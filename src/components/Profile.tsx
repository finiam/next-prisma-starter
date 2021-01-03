import React, { useState } from "react";
import { User } from "@prisma/client";
import redaxios from "redaxios";
import { useForm } from "react-hook-form";
import useServerRefresher from "root/hooks/useServerRefresher";

interface Props {
  user: User;
}

export default function Profile({ user }: Props) {
  const [error, setError] = useState();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: user,
  });
  const refresh = useServerRefresher();

  const onSubmit = async (params) => {
    try {
      await redaxios.put("/api/user", params);
      refresh();
    } catch (error) {
      setError(error);
    }
  };

  const onClick = async () => {
    try {
      if (!confirm("Are you sure? Everything will be deleted!")) return;

      await redaxios.delete("/api/user");
      refresh();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl">Profile</h1>

      <form
        className="mt-14 max-w-lg space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="flex flex-col">
          Email
          <input type="text" name="email" ref={register()} />
        </label>

        <label className="flex flex-col">
          Password
          <input type="password" name="password" ref={register()} />
        </label>

        {error && (
          <p className="text-red-500">
            Welp seems that this profile is invalid
          </p>
        )}

        <button
          className="mt-2 text-blue-500 hover:underline"
          type="button"
          onClick={onClick}
        >
          Delete my account
        </button>

        <div className="space-x-4">
          <button className="button">Submit</button>
        </div>
      </form>

      {formState.isSubmitted && !error && (
        <p className="mt-2">Profile updated! :)</p>
      )}
    </div>
  );
}

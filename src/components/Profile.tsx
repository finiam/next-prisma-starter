import React, { useState } from "react";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useServerRefresher from "root/hooks/useServerRefresher";
import { deleteUser, updateUser } from "root/pages/api/users";

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
      await updateUser(params);
      refresh();
    } catch (networkError) {
      setError(networkError);
    }
  };

  const onClick = async () => {
    try {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (!confirm("Are you sure? Everything will be deleted!")) return;

      await deleteUser();
      refresh();
    } catch (networkError) {
      setError(networkError);
    }
  };

  return (
    <div>
      <h1 className="text-3xl">Profile</h1>

      <form
        className="mt-14 max-w-lg space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="flex flex-col" htmlFor="name">
          Email
          <input id="name" type="text" name="email" ref={register()} />
        </label>

        <label className="flex flex-col" htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            name="password"
            ref={register()}
          />
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
          <button className="button" type="submit">
            Submit
          </button>
        </div>
      </form>

      {formState.isSubmitted && !error && (
        <p className="mt-2">Profile updated! :)</p>
      )}
    </div>
  );
}

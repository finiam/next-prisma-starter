import React from "react";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useServerRefresher from "src/hooks/useServerRefresher";
import { useMutation } from "graphql-hooks";

interface Props {
  user: User;
}

export default function Profile({ user }: Props) {
  const refresh = useServerRefresher();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: user,
  });
  const [updateUserMutation, updateUserMutationState] = useMutation(`
    mutation UpdateUser($email: String!, $name: String!, $password: String!) {
      updateUser(email: $email, name: $name, password: $password) {
        id
        name
        email
      }
    }
  `);
  const [deleteUserMutation, deleteUserMutationState] = useMutation(`
    mutation DeleteUser {
      deleteUser {
        id
        name
        email
      }
    }
  `);

  const handleFormSubmit = async (params) => {
    await updateUserMutation({ variables: params });
    refresh();
  };

  const onClick = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (!confirm("Are you sure? Everything will be deleted!")) return;

    await deleteUserMutation();
    refresh();
  };

  return (
    <div>
      <h1 className="text-3xl">Profile</h1>

      <form
        className="mt-14 max-w-lg space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <label className="flex flex-col" htmlFor="name">
          Email
          <input type="text" {...register("email")} />
        </label>

        <label className="flex flex-col" htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            {...register("name", { required: true })}
          />
        </label>

        <label className="flex flex-col" htmlFor="password">
          Password
          <input type="password" {...register("password")} />
        </label>

        {updateUserMutationState.error && (
          <p className="text-red-500">
            Welp seems that this profile is invalid
          </p>
        )}

        <button
          className="u-link disabled:opacity-50"
          type="button"
          onClick={onClick}
          disabled={deleteUserMutationState.loading}
        >
          Delete my account
        </button>

        {deleteUserMutationState.error && (
          <p className="text-red-500">
            Welp seems that we can&apos;t delete the account for some reason
          </p>
        )}

        <div className="space-x-4">
          <button
            className="u-button disabled:opacity-50"
            type="submit"
            disabled={updateUserMutationState.loading}
          >
            Submit
          </button>
        </div>
      </form>

      {formState.isSubmitted && updateUserMutationState.data?.updateUser && (
        <p className="mt-2">Profile updated! :)</p>
      )}
    </div>
  );
}

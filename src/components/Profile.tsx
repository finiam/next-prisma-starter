import React from "react";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useServerRefresher from "root/hooks/useServerRefresher";
import useNetworkResource from "root/hooks/useNetworkResource";
import { deleteUser, updateUser } from "root/web/apiRoutes";

interface Props {
  user: User;
}

export default function Profile({ user }: Props) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: user,
  });
  const refresh = useServerRefresher();
  const [
    updateUserApi,
    { loading: updatingUser, data: updatedUser, error: updateUserError },
  ] = useNetworkResource(updateUser, {
    onSuccess: refresh,
  });
  const [deleteUserApi, { loading: deletingUser, error: deleteUserError }] =
    useNetworkResource(deleteUser, {
      onSuccess: refresh,
    });

  const handleFormSubmit = (params) => updateUserApi(params);

  const onClick = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (!confirm("Are you sure? Everything will be deleted!")) return;

    await deleteUserApi();
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

        {updateUserError && (
          <p className="text-red-500">
            Welp seems that this profile is invalid
          </p>
        )}

        <button
          className="u-link disabled:opacity-50"
          type="button"
          onClick={onClick}
          disabled={deletingUser}
        >
          Delete my account
        </button>

        {deleteUserError && (
          <p className="text-red-500">
            Welp seems that we can&apos;t delete the account for some reason
          </p>
        )}

        <div className="space-x-4">
          <button
            className="u-button disabled:opacity-50"
            type="submit"
            disabled={updatingUser}
          >
            Submit
          </button>
        </div>
      </form>

      {formState.isSubmitted && updatedUser && (
        <p className="mt-2">Profile updated! :)</p>
      )}
    </div>
  );
}

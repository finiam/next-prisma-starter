import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "graphql-hooks";
import useServerRefresher from "src/hooks/useServerRefresher";

export default function Login() {
  const refresh = useServerRefresher();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
  const [loginMutation, loginMutationState] = useMutation(`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        name
        email
      }
    }
  `);

  const onSubmit = async (params) => {
    const response = await loginMutation({ variables: params });

    if (response.data.login) refresh();
    else {
      setError("loginStatus", { message: "failed" });
    }
  };

  return (
    <form
      className="h-screen u-center flex flex-col items-center space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Head>
        <title>Login</title>
      </Head>

      <div className="space-y-8">
        <h1 className="self-start text-xl">Login</h1>

        <label className="flex flex-col" htmlFor="email">
          Email
          <input type="text" {...register("email", { required: true })} />
        </label>

        <label className="flex flex-col" htmlFor="password">
          Password
          <input
            type="password"
            {...register("password", { required: true })}
          />
        </label>

        <button
          className="u-button"
          type="submit"
          disabled={
            Object.keys(errors).length > 0 || loginMutationState.loading
          }
        >
          Login
        </button>

        {(loginMutationState.error || Object.keys(errors).length > 0) && (
          <p>User password combination not found</p>
        )}

        <Link href="/signup">
          <a className="block underline" href="/signup">
            Sign up
          </a>
        </Link>
      </div>
    </form>
  );
}

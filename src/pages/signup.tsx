import React from "react";
import Head from "next/head";
import { getCurrentUser } from "root/lib/auth/tokenUtils";
import { UNAUTHENTICATED_ERROR } from "root/lib/errorTypes";
import { useForm } from "react-hook-form";
import Link from "next/link";
import useServerRefresher from "root/hooks/useServerRefresher";
import useRpc from "root/hooks/useRpc";
import { createUser } from "./api/auth";

export default function SignUp() {
  const { handleSubmit, register } = useForm();
  const [createUserRpc, { loading, error }] = useRpc(createUser, {
    onSuccess: useServerRefresher(),
  });

  const handleCreateUser = (params) => createUserRpc(params);

  return (
    <main>
      <form
        className="h-screen center flex flex-col items-center justify-center"
        onSubmit={handleSubmit(handleCreateUser)}
      >
        <Head>
          <title>Login</title>
        </Head>

        <div className="space-y-8">
          <h1 className="self-start text-xl">Sign up</h1>

          <label className="flex flex-col" htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
            />
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
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
            />
          </label>

          <button className="u-button" type="submit" disabled={loading}>
            Sign Up
          </button>

          {error && <p>User exists</p>}

          <Link href="/">
            <a className="block underline" href="/">
              Login
            </a>
          </Link>
        </div>
      </form>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    await getCurrentUser();

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } catch (error) {
    if (error.message === UNAUTHENTICATED_ERROR) {
      return {
        props: {},
      };
    }

    throw error;
  }
}

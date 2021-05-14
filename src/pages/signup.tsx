import React from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import useServerRefresher from "root/hooks/useServerRefresher";
import useNetworkResource from "root/hooks/useNetworkResource";
import { userFromRequest } from "root/web/tokens";
import { createUser } from "root/web/apiRoutes";

export default function SignUp() {
  const { handleSubmit, register } = useForm();
  const [createUserApi, { loading, error }] = useNetworkResource(createUser, {
    onSuccess: useServerRefresher(),
  });

  const handleCreateUser = (params) => createUserApi(params);

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await userFromRequest(context.req);

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

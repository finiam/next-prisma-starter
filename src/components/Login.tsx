import React, { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import useServerRefresher from "root/hooks/useServerRefresher";
import { login } from "root/pages/api/auth";
import Link from "next/link";

export default function Login() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState();
  const refresh = useServerRefresher();

  const onSubmit = async (params: { email: string; password: string }) => {
    try {
      await login(params);

      refresh();
    } catch (networkError) {
      setError(networkError);
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
          <input type="email" {...register("email", { required: true })} />
        </label>

        <label className="flex flex-col" htmlFor="password">
          Password
          <input
            type="password"
            {...register("password", { required: true })}
          />
        </label>

        <button className="u-button" type="submit">
          Login
        </button>

        {error && <p>User password combination not found</p>}

        <Link href="/signup">
          <a className="block underline" href="/signup">
            Sign up
          </a>
        </Link>
      </div>
    </form>
  );
}

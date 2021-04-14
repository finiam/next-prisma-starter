import React, { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import useServerRefresher from "root/hooks/useServerRefresher";
import { login } from "root/pages/api/auth";

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
      className="h-screen center flex flex-col items-center space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Head>
        <title>Login</title>
      </Head>

      <label className="flex flex-col" htmlFor="email">
        Email
        <input type="email" {...register("email", { required: true })} />
      </label>

      <label className="flex flex-col" htmlFor="password">
        Password
        <input type="password" {...register("password", { required: true })} />
      </label>

      <button className="button" type="submit">
        Login
      </button>

      {error && <p>User password combination not found</p>}
    </form>
  );
}

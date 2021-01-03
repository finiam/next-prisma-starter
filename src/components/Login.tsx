import React, { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import redaxios from "redaxios";
import useServerRefresher from "root/hooks/useServerRefresher";

export default function Login() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState();
  const refresh = useServerRefresher();

  const onSubmit = async (params) => {
    try {
      await redaxios.post("/api/sessions", params);

      refresh();
    } catch (networkError) {
      setError(networkError);
    }
  };

  return (
    <form
      className="absolute-center flex flex-col items-center space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Head>
        <title>Login</title>
      </Head>
      <label className="flex flex-col" htmlFor="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          ref={register({ required: true })}
        />
      </label>

      <label className="flex flex-col" htmlFor="password">
        Password
        <input
          id="password"
          name="password"
          type="password"
          ref={register({ required: true })}
        />
      </label>

      <button className="button" type="submit">
        Login
      </button>

      {error && <p>User password combination not found</p>}
    </form>
  );
}

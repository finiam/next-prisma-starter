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
    } catch (error) {
      setError(error);
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
      <label className="flex flex-col">
        Email
        <input
          className="form-input"
          name="email"
          type="email"
          ref={register({ required: true })}
        />
      </label>

      <label className="flex flex-col">
        Password
        <input
          name="password"
          type="password"
          ref={register({ required: true })}
        />
      </label>

      <button className="button">Login</button>

      {error && <p>User password combination not found</p>}
    </form>
  );
}

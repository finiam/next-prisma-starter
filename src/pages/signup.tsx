import React from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import useServerRefresher from "src/hooks/useServerRefresher";
import { userFromRequest } from "src/web/tokens";
import { useMutation } from "graphql-hooks";

export default function SignUp() {
  const refresh = useServerRefresher();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [createUserMutation, createUserMutationState] = useMutation(`
    mutation CreateUser($email: String!, $name: String!, $password: String!) {
      createUser(email: $email, name: $name, password: $password) {
        id
        name
        email
      }
    }
  `);

  const handleCreateUser = async (params) => {
    await createUserMutation({ variables: params });

    refresh();
  };

  return (
    <main>
      <form
        className="h-screen center flex flex-col items-center justify-center"
        onSubmit={handleSubmit(handleCreateUser)}
      >
        <Head>
          <title>Sign Up</title>
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

          <button
            className="u-button"
            type="submit"
            disabled={
              Object.keys(errors).length > 0 || createUserMutationState.loading
            }
          >
            Sign Up
          </button>

          {(Object.keys(errors).length > 0 ||
            createUserMutationState.error) && <p>User exists</p>}

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

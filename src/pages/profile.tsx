import React from "react";
import { User } from "@prisma/client";
import superjson from "superjson";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Login from "src/components/Login";
import Navbar from "src/components/Navbar";
import Profile from "src/components/Profile";
import { userFromRequest } from "src/web/tokens";

interface Props {
  user?: User;
}

export default function Home({ user }: Props) {
  if (!user) return <Login />;

  return (
    <main className="max-w-4xl mx-auto py-20 space-y-8">
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar user={user} />
      <Profile user={user} />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await userFromRequest(context.req);

  if (!user) return { props: {} };

  return {
    props: superjson.serialize({
      user,
    }).json,
  };
}

import React from "react";
import { User } from "@prisma/client";
import superjson from "superjson";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Login from "root/components/Login";
import { userFromToken } from "root/lib/tokenUtils";
import Navbar from "root/components/Navbar";
import Profile from "root/components/Profile";
import { UNAUTHENTICATED_ERROR } from "root/lib/errorTypes";

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
  try {
    const user = await userFromToken(context.req.cookies.auth);

    return {
      props: superjson.serialize({
        user,
      }).json,
    };
  } catch (error) {
    if (error.message === UNAUTHENTICATED_ERROR) return { props: {} };

    throw error;
  }
}

import React from "react";
import superjson from "superjson";
import Head from "next/head";
import Login from "root/components/Login";
import { getCurrentUser } from "root/lib/auth/tokenUtils";
import Navbar from "root/components/Navbar";
import Profile from "root/components/Profile";
import { UNAUTHENTICATED_ERROR } from "root/lib/errorTypes";
import { User } from ".prisma/client";

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

export async function getServerSideProps() {
  try {
    const user = await getCurrentUser();

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

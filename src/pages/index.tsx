import React from "react";
import { User, Note } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import superjson from "superjson";
import Login from "src/components/Login";
import Notes from "src/components/Notes";
import Navbar from "src/components/Navbar";
import { userFromRequest } from "src/web/tokens";
import { listNotes } from "lib/notes";

interface Props {
  user?: User;
  notes?: Note[];
}

export default function Home({ user, notes }: Props) {
  if (!user) return <Login />;

  return (
    <main className="max-w-4xl mx-auto py-20 space-y-8">
      <Head>
        <title>Notes</title>
      </Head>
      <Navbar user={user} />
      <Notes notes={notes} />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await userFromRequest(context.req);

  if (!user) return { props: {} };

  const notes = await listNotes(user);

  return {
    props: superjson.serialize({
      user,
      notes,
    }).json,
  };
}

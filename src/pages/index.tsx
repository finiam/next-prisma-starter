import React from "react";
import { GetServerSidePropsContext } from "next";
import { User, Note } from "@prisma/client";
import Head from "next/head";
import superjson from "superjson";
import Login from "root/components/Login";
import Notes from "root/components/Notes";
import { userFromToken } from "root/lib/tokenUtils";
import Navbar from "root/components/Navbar";
import { UNAUTHENTICATED_ERROR } from "root/lib/errorTypes";
import { listNotes } from "./api/notes";

interface Props {
  user?: User;
  notes: Note[];
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
  try {
    const user = await userFromToken(context.req.cookies.auth);
    const notes = await listNotes();

    return {
      props: superjson.serialize({
        user,
        notes,
      }).json,
    };
  } catch (error) {
    if (error.message === UNAUTHENTICATED_ERROR) return { props: {} };

    throw error;
  }
}

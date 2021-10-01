import React from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import useServerRefresher from "src/hooks/useServerRefresher";
import { useMutation } from "graphql-hooks";

interface Props {
  user: User;
}

export default function Navbar({ user }: Props) {
  const refresh = useServerRefresher();
  const [logoutMutation] = useMutation(`
    mutation Logout {
      logout
    }
  `);

  const onLogout = async () => {
    await logoutMutation();

    refresh();
  };

  return (
    <nav className="flex justify-between">
      <p>Logged in as {user.email}</p>

      <div className="flex flex-between items-center">
        <ul className="flex space-x-8">
          <li className="hover:underline">
            <Link href="/">Notes</Link>
          </li>
          <li className="hover:underline">
            <Link href="/profile">Profile</Link>
          </li>
        </ul>

        <button className="ml-8 button" onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </nav>
  );
}

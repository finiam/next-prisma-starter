import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { serialize } from "cookie";
import { findUserByEmail } from "root/lib/users";
import { NextApiRequest, NextApiResponse } from "next";

const { SECRET_KEY } = process.env;
const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): void {
  const stringValue =
    typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
}

export function authenticateUser(user: User, res: NextApiResponse): void {
  if (!user) return;

  const token = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: "1d",
  });

  setCookie(res, "auth", token, cookieOptions);
}

export function clearUser(res: NextApiResponse): void {
  setCookie(res, "auth", "0", {
    ...cookieOptions,
    path: "/",
    maxAge: 1,
  });
}

export async function userFromToken(token: string): Promise<User> {
  if (!token) return undefined;

  try {
    const data = jwt.verify(token, SECRET_KEY);

    if (!data) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return findUserByEmail((data as any).email);
  } catch (error) {
    return undefined;
  }
}

export async function ensureAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | undefined> {
  const user = await userFromToken(req.cookies.auth);

  if (!user) {
    res.status(404).end("");
    res.end();

    return undefined;
  }

  return user;
}

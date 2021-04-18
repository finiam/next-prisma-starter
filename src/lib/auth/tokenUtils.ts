import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { getContext } from "next-rpc/context";
import prisma from "root/lib/prisma";
import { UNAUTHENTICATED_ERROR } from "root/lib/errorTypes";

const { SECRET_KEY } = process.env;
const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

export function setCookie(
  res: any,
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): void {
  const stringValue =
    typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
}

export function authenticateUser(user: User): void {
  const { res } = getContext();

  if (!user) return;

  const token = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: "1d",
  });

  setCookie(res, "auth", token, cookieOptions);
}

export function clearUser(): void {
  const { res } = getContext();

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

    const user = await prisma.user.findUnique({
      where: { email: (data as any).email },
    });

    if (user) user.password = "";

    return user;
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

export async function getCurrentUser(): Promise<User> {
  const { req } = getContext();
  const user = await userFromToken((req as any).cookies.auth);

  if (!user) throw new Error(UNAUTHENTICATED_ERROR);

  return user;
}

import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { NextApiResponse } from "next";
import prisma from "lib/prisma";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

const { JWT_TOKEN_KEY } = process.env;
const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

function setCookie(
  res: any,
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): void {
  const stringValue =
    typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
}

export function authenticateUser(res: NextApiResponse, user: User): void {
  if (!user) return;

  const token = jwt.sign({ email: user.email }, JWT_TOKEN_KEY, {
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

export async function userFromRequest(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<User> {
  const { auth: token } = req.cookies;

  if (!token) return undefined;

  try {
    const data = jwt.verify(token, JWT_TOKEN_KEY);

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

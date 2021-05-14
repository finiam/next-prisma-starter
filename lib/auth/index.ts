import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { encryptPassword, verifyPassword } from "./passwordUtils";

interface UserParams {
  email: string;
  name: string;
  password: string;
}

export async function createUser(params: UserParams): Promise<User> {
  const password = await encryptPassword(params.password);
  const user = await prisma.user.create({
    data: { ...params, password },
  });

  user.password = "";

  return user;
}

export async function login(params: UserParams): Promise<User> {
  const user = await prisma.user.findUnique({ where: { email: params.email } });

  if (!user) return null;

  if (await verifyPassword(user.password, params.password)) {
    user.password = "";

    return user;
  }

  return null;
}

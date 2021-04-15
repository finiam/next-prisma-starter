import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NOT_FOUND_ERROR } from "root/lib/errorTypes";
import prisma from "root/lib/prisma";
import { authenticateUser, clearUser } from "root/lib/tokenUtils";

export const config = { rpc: true };

interface UserParams {
  email: string;
  name: string;
  password: string;
}

export async function createUser(params: UserParams): Promise<User> {
  const password = await bcrypt.hash(params.password, 10);
  const user = await prisma.user.create({
    data: { ...params, password },
  });

  user.password = "";
  authenticateUser(user);

  return user;
}

export async function login(params: UserParams): Promise<User> {
  const user = await prisma.user.findUnique({ where: { email: params.email } });

  if (!user) throw new Error(NOT_FOUND_ERROR);

  if (await bcrypt.compare(params.password, user.password)) {
    user.password = "";
    authenticateUser(user);

    return user;
  }

  throw new Error(NOT_FOUND_ERROR);
}

export async function logout(): Promise<void> {
  clearUser();
}
